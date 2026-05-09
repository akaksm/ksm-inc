import mongoose from 'mongoose'
import { createVenue, deleteVenue, findAllVenues, findVenueById, findVenuesByCity, updateVenue } from './venue.repository.js'
import AppError from '../../utils/AppError.js'

class VenueService {
    async createVenue(data) {
        const { name, location, city } = data

        if (!name || !location || !city) throw new AppError('One or more field cannot be empty.', 400)

        return createVenue(data)
    }

    async getVenueById(id) {
        this.#validateObjectId(id)

        const venue = await findVenueById(id)

        if (!venue) throw new AppError('Venue not found', 404)

        return venue
    }

    async getAllVenues(filters = {}) {
        const { city } = filters

        if (city) {
            return await findVenuesByCity(city.trim())
        }

        return findAllVenues()
    }

    async updateVenue(id, data) {

        this.#validateObjectId(id)

        const updatedVenue = await updateVenue(id, data)

        if (!updatedVenue) throw new AppError('Venue not found', 404)

        return updatedVenue
    }

    async deleteVenue(id) {
        this.#validateObjectId(id)

        const deletedVenue = await deleteVenue(id)

        if (!deletedVenue) throw new AppError('Venue not found', 404)

        return deletedVenue
    }

    #validateObjectId(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid venue id', 400)
    }
}

export default new VenueService()