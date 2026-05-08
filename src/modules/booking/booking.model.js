import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    showtime_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Showtime',
        required: true,
    },
    total_amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED'],
        default: 'PENDING'
    },
    payment_id: {
        type: String,
        unique: true,
        sparse: true
    },
    qr_code: {
        type: String
    }
}, { timestamps: true });

bookingSchema.index({ user_id: 1, showtime_id: 1 })

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking
