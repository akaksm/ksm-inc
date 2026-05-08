import mongoose from 'mongoose'

const seatTemplateSchema = new mongoose.Schema({
    screen_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Screen',
        required: true
    },
    row_label: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    seat_number: {
        type: Number,
        required: true,
    },
    seat_type: {
        type: String,
        enum: ['NORMAL', 'PREMIUM', 'VIP', 'RECLINER'],
        default: 'NORMAL'
    },
    x_coord: {
        type: Number,
        required: true
    },
    y_coord: {
        type: Number,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_aisle: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

seatTemplateSchema.index({ screen_id: 1, row_label: 1, seat_number: 1 }, { unique: true })

const SeatTemplate = mongoose.model('SeatTemplate', seatTemplateSchema)

export default SeatTemplate