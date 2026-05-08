import Movie from "./movie.model.js"

/**
 * Creates a new movie document.
 * @param {Object} data - The movie data
 * @returns {Promise<Object>} The created Mongoose document
 */
export const createMovie = async (data) => {
    return Movie.create(data)
}

/**
 * Finds a single movie by its ObjectId.
 * @param {String} id - The movie's ObjectId
 * @returns {Promise<Object|null>} The Mongoose document or null if not found
 */
export const findMovieById = async (id) => {
    return Movie.findById(id)
}

/**
 * Retrieves all movie documents.
 * @returns {Promise<Array>} Array of Mongoose documents
 */
export const findAllMovies = async () => {
    return Movie.find()
}

/**
 * Retrieves movies matching a specific title (case-insensitive).
 * @param {String} title - The title to search for
 * @returns {Promise<Array>} Array of matching Mongoose documents
 */
export const findMovieByTitle = async (title) => {
    return Movie.find({ title: new RegExp(title, 'i') })
}

/**
 * Finds a movie by ID and updates it with new data.
 * @param {String} id - The movie's ObjectId
 * @param {Object} data - The data to update
 * @returns {Promise<Object|null>} The updated Mongoose document or null if not found
 */
export const updateMovie = async (id, data) => {
    return Movie.findByIdAndUpdate(id, data, { new: true, runValidators: true })
}

/**
 * Finds a movie by ID and removes it from the database.
 * @param {String} id - The movie's ObjectId
 * @returns {Promise<Object|null>} The deleted Mongoose document or null if not found
 */
export const deleteMovie = async (id) => {
    return Movie.findByIdAndDelete(id)
}