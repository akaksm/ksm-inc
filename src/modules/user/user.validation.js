import Joi from "joi";


export const updateMe = Joi.object({
    name: Joi.string().trim().max(50),
    phoneNumber: Joi.string().trim(),
    preferredCity: Joi.string().trim(),
    avatar: Joi.string().uri()
})

export const changePassword = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128).required(),
    passwordConfirm: Joi.valid(Joi.ref('newPassword')).required().message({
        'any.only': 'Passwords do not match'
    })
})