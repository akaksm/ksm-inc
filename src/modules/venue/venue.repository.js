import Venue from "./venue.model.js";


class VenueRepository {
    /**
     * Creates a new venue document.
     * @param {Object} data - The venue data
     * @returns {Promise<Object>} The created Mongoose document
     */
    async createVenue(data) {
        return Venue.create(data)
    }

    /**
     * Finds a single venue by its ObjectId.
     * @param {String} id - The venue's ObjectId
     * @returns {Promise<Object|null>} The Mongoose document or null if not found
     */
    async findVenueById(id) {
        return Venue.findById(id)
    }

    /**
     * Retrieves all venue documents.
     * @returns {Promise<Array>} Array of Mongoose documents
     */
    async findAllVenues() {
        return Venue.find()
    }

    /**
     * Retrieves all venues located in a specific city.
     * @param {String} city - The city to filter by
     * @returns {Promise<Array>} Array of Mongoose documents
     */
    async findVenuesByCity(city) {
        return Venue.find({
            city: {
                $regex: city,
                $options: 'i'
            }
        })
    }

    /**
     * Finds a venue by ID and updates it with new data.
     * @param {String} id - The venue's ObjectId
     * @param {Object} data - The data to update
     * @returns {Promise<Object|null>} The updated Mongoose document or null if not found
     */
    async updateVenue(id, data) {
        return Venue.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    }

    /**
     * Finds a venue by ID and removes it from the database.
     * @param {String} id - The venue's ObjectId
     * @returns {Promise<Object|null>} The deleted Mongoose document or null if not found
     */
    async deleteVenue(id) {
        return Venue.findByIdAndDelete(id)
    }
}

const venueRepository = new VenueRepository()

export default venueRepository