class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.status = statusCode >= 400 && statusCode < 50 ? 'fail' : 'fail'
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }
}

export default AppError