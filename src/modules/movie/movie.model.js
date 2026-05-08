import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    duration_mins: {
        type: Number,
        required: true,
        min: 1
    },
    language: {
        type: String,
        required: true,
        trim: true
    },
    release_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['UPCOMING', 'NOW_SHOWING', 'ARCHIVED'],
        default: 'UPCOMING'
    },
    poster_url: {
        type: String,
        required: true
    },
    genre: [{
        type: String, // e.g., ['Action', 'Sci-Fi']
        required: true
    }],
    rating: {
        type: String,
        enum: ['U', 'UA', 'A', 'R'], // Typical cinema ratings
        default: 'UA'
    },
    description: {
        type: String,
        maxLength: 1000
    },
    trailer_url: {
        type: String
    }
}, { timestamps: true });

movieSchema.index({ title: 1 })

const Movie = mongoose.model('Movie', movieSchema);

export default Movie
