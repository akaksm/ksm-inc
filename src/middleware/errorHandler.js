import e from "express"
import AppError from "../utils/AppError.js"
import { node_env } from "../config/index.js"

// Triggerd when: invalid MongoDb ObjectID form
const handleCastError = (err) => {
    return new AppError(`Invalid ${err.path}: '${err.value}' is not a valid ID`, 400)
}

// Triggered when: inserting a document that violates a unique index
const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue)[0]
    const value = err.keyValue[field]
    return new AppError(`'${value}' already exists. Please use a different ${field}`, 409)
}

// Triggered when: Mongoose schema validation fails
const handleValidationError = (err) => {
    const message = Object.values(err.errors).map((e) => e.message)
    return new AppError(`Validation failed: ${message.join('. ')}`, 400)
}

// Triggered when: JWT token has been tampered with
const handleJWTError = () => {
    return new AppError(`Invalid token. Please log in again`, 401)
}

// Triggered when: JWT token exists but has expired
const handleJWTExpiredError = () => {
    return new AppError(`Your session has expired. Please log in again`, 401)
}

// Triggered when: request body is malformed JSON
const handleSyntaxError = () => {
    return new AppError('Invalid JSON in request body', 400)
}

// Development - send full details so you can debug fast
const sendDevError = (err, req, res) => {
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
        request: {
            method: req.method,
            url: req.originalUrl,
            body: req.body
        }
    })
}

// Production - send only what client needs, nothing internal
const sendProdError = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message
        })
    }

    console.error(`UNEXPECTED ERROR`, err)

    return res.status(500).json({
        success: false,
        status: 'error',
        message: 'Something went wrong. Please try again later'
    })
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    console.log(err)

    if (node_env === 'development') {
        sendDevError(err, req, res)
    } else if (node_env == 'production') {
        let error = { ...err, message: err.message, name: err.name }

        // Mongoose errors
        if (error.name === 'CastError') error = handleCastError(error)
        if (error.code === 11000) error = handleDuplicateKeyError(error)
        if (error.name === 'ValidationError') error = handleValidationError(error)

        // JWT errors
        if (error.name === 'JsonWebTokenError') error = handleJWTError()
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

        // JSON body parse error
        if (error.type === 'entity.parse.failed') error = handleSyntaxError()

        sendProdError(error, res)
    }
}

export default errorHandler