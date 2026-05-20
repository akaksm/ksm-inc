import AppError from "../utils/AppError"

export const validate = (schema, source = 'body') => (req, res, next) => {
    const { error, value } = schema.validate(req[source], { abortEarly: false })

    if (error) {
        const message = error.details.map((d) => d.message).join(', ')
        return next(new AppError(message, 400))
    }
    req[source] = value
    next()
}