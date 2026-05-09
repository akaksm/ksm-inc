import mongoose from 'mongoose'

const screenSchema = new mongoose.Schema({
    venue_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue',
        required: [true, `Venue is required`]
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [30, 'Cannot exceed word length more than 30'],
        validate: {
            validator: v => typeof v === 'string',
            message: 'Name must be a string'
        }
    },
    screen_type: {
        type: String,
        enum: ['2D', '3D', 'IMAX', '4DX'],
        default: '2D'
    }
}, { timestamps: true })

screenSchema.index({ venue_id: 1 })
screenSchema.index({ screen_type: 1 })

const Screen = mongoose.model('Screen', screenSchema)

export default Screen