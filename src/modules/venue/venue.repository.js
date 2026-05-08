import Venue from "./venue.model.js";

/**
 * Creates a new venue document.
 * @param {Object} data - The venue data
 * @returns {Promise<Object>} The created Mongoose document
 */
export const createVenue = async (data) => {
    return Venue.create(data)
}

/**
 * Finds a single venue by its ObjectId.
 * @param {String} id - The venue's ObjectId
 * @returns {Promise<Object|null>} The Mongoose document or null if not found
 */
export const findVenueById = async (id) => {
    return Venue.findById(id)
}

/**
 * Retrieves all venue documents.
 * @returns {Promise<Array>} Array of Mongoose documents
 */
export const findAllVenues = async () => {
    return Venue.find()
}

/**
 * Retrieves all venues located in a specific city.
 * @param {String} city - The city to filter by
 * @returns {Promise<Array>} Array of Mongoose documents
 */
export const findVenuesByCity = async (city) => {
    return Venue.find({ city })
}

/**
 * Finds a venue by ID and updates it with new data.
 * @param {String} id - The venue's ObjectId
 * @param {Object} data - The data to update
 * @returns {Promise<Object|null>} The updated Mongoose document or null if not found
 */
export const updateVenue = async (id, data) => {
    // { new: true } ensures Mongoose returns the updated document, not the old one.
    // { runValidators: true } ensures the new data adheres to your schema rules (e.g., maxlength).
    return Venue.findByIdAndUpdate(id, data, { new: true, runValidators: true })
}

/**
 * Finds a venue by ID and removes it from the database.
 * @param {String} id - The venue's ObjectId
 * @returns {Promise<Object|null>} The deleted Mongoose document or null if not found
 */
export const deleteVenue = async (id) => {
    return Venue.findByIdAndDelete(id)
}