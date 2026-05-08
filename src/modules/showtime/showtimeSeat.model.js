import mongoose from 'mongoose'

const showtimeSeatSchema = new mongoose.Schema({
    showtime_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Showtime',
        required: true,
    },
    seat_template_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SeatTemplate',
        required: true
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'LOCKED', 'BOOKED', 'RESERVED'],
        default: 'AVAILABLE',
    },
    locked_until: {
        type: Date,
        default: null
    },
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

showtimeSeatSchema.index({ showtime_id: 1, seat_template_id: 1 }, { unique: true });

const ShowtimeSeat = mongoose.model('ShowtimeSeat', showtimeSeatSchema);

export default ShowtimeSeat
