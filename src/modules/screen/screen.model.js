import mongoose from 'mongoose'

const screenSchema = new mongoose.Schema({
    venue_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    screen_type: {
        type: String,
        enum: ['2D', '3D', 'IMAX', '4DX'],
        default: '2D'
    }
}, { timestamps: true })

screenSchema.index({ venue_id: 1 })

const Screen = mongoose.model('Screen', screenSchema)

export default Screen