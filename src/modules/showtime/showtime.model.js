import mongoose from 'mongoose'

const showtimeSchema = new mongoose.Schema({
    movie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    screen_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Screen',
        required: true,
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date
    },
    status: {
        type: String,
        enum: ['SCHEDULED', 'ACTIVE', 'CANCELLED', 'COMPLETED'],
        default: 'SCHEDULED'
    },
    // Pricing Strategy
    pricing: {
        NORMAL: { type: Number, required: true },
        PREMIUM: { type: Number, required: true },
        VIP: { type: Number, required: true },
        RECLINER: { type: Number, required: true }
    }
}, { timestamps: true });

showtimeSchema.index({ movie_id: 1 })
showtimeSchema.index({ screen_id: 1, start_time: 1 });

showtimeSchema.pre('save', async function (next) {
    const movie = await mongoose.model('Movie').findById(this.movie_id)
    this.end_time = new Date(this.start_time.getTime() + movie.duration_mins * 60000)
    next()
})

const Showtime = mongoose.model('Showtime', showtimeSchema);

export default Showtime
