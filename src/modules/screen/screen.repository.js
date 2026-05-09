import Screen from "./screen.model.js"


/**
 * Creates a new screen document.
 * @param {Object} data - The screen data
 * @returns {Promise<Object>} The created Mongoose document
 */
export const createScreen = async (data) => {
    return Screen.create(data)
}

/**
 * Finds a single screen by its ObjectId.
 * @param {String} id - The screen's ObjectId
 * @returns {Promise<Object|null>} The Mongoose document or null if not found
 */
export const findScreenById = async (id) => {
    return Screen.findById(id)
}

/**
 * Retrieves all screen documents.
 * @returns {Promise<Array>} Array of Mongoose documents
 */
export const findAllScreens = async () => {
    return Screen.find()
}

/**
 * Retrieves all screens of a specific venue.
 * @param {String} venue - The city to filter by
 * @returns {Promise<Array>} Array of Mongoose documents
 */
export const findScreenByVenueId = async (venueId) => {
    return Screen.find({ venue_id: venueId })
}

/**
 * Finds a screen by ID and updates it with new data.
 * @param {String} id - The screen's ObjectId
 * @param {Object} data - The data to update
 * @returns {Promise<Object|null>} The updated Mongoose document or null if not found
 */
export const updateScreen = async (id, data) => {
    return Screen.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    })
}

/**
 * Finds a screen by ID and removes it from the database.
 * @param {String} id - The screen's ObjectId
 * @returns {Promise<Object|null>} The deleted Mongoose document or null if not found
 */
export const deleteScreen = async (id) => {
    return Screen.findByIdAndDelete(id)
}