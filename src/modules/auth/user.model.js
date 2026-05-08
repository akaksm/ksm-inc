import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    phone_number: {
        type: String,
        trim: true,
        index: true,
        match: [/^\+?[\d\s\-]{7,15}$/, 'Please provide a valid phone number']
    },
    role: {
        type: String,
        enum: ['CUSTOMER', 'ADMIN', 'VENUE_MANAGER'],
        default: 'CUSTOMER'
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    preferred_city: {
        type: String,
        trim: true
    },
    payment_customer_id: {
        type: String
    }
}, { timestamps: true });

userSchema.index({ email: 1 })

const User = mongoose.model('User', userSchema);

export default User
