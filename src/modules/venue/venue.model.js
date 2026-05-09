import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, `Cannot exceed word length more than 50`]
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        maxlength: [50, `Cannot exceed word length more than 50`]
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        maxlength: [50, `Cannot exceed word length more than 50`]
    }
}, { timestamps: true })

venueSchema.index({ city: 1 })

const Venue = mongoose.model('Venue', venueSchema)

export default Venue