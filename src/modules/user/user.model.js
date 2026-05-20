import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `Name is required`],
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, `Email is required`],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, `Password is required`],
        select: false
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ['CUSTOMER', 'ADMIN', 'VENUE_MANAGER'],
        default: 'CUSTOMER'
    },
    avatar: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    emailVerificationToken: {
        type: String,
        select: false
    },
    emailVerificationTokenExpiresAt: {
        type: Date,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetTokenExpiresAt: {
        type: Date,
        select: false
    },
    passwordChangedAt: Date,
    lastLoginAt: Date,
    preferred_city: {
        type: String,
        trim: true
    },
    payment_customer_id: String,
}, { timestamps: true });

// For email
userSchema.index({ email: 1 }, { unique: true })

// For pagination
userSchema.index({ createdAt: -1 })

// For payment provider lookups
userSchema.index({ payment_customer_id: 1 }, { unique: true })

// For verification flows
userSchema.index({ emailVerificationToken: 1, emailVerificationTokenExpiresAt: 1 })
userSchema.index({ passwordResetToken: 1, passwordResetTokenExpiresAt: 1 })

// For role-based queries
userSchema.index({ role: 1, isActive: 1 })

// TTL cleanup
userSchema.index({ emailVerificationTokenExpiresAt: 1 }, { expireAfterSeconds: 0 })
userSchema.index({ passwordResetTokenExpiresAt: 1 }, { expireAfterSeconds: 0 })


const User = mongoose.model('User', userSchema);

export default User
