import mongoose from 'mongoose'
import venueRepository from './venue.repository.js'
import AppError from '../../utils/AppError.js'

class VenueService {
    async createVenue(data) {
        return venueRepository.createVenue(data)
    }

    async getVenueById(id) {
        this.#validateObjectId(id)

        const venue = await venueRepository.findVenueById(id)

        if (!venue) throw new AppError('Venue not found', 404)

        return venue
    }

    async getAllVenues(filters = {}) {
        const { city } = filters

        if (city) {
            return await venueRepository.findVenuesByCity(city.trim())
        }

        return findAllVenues()
    }

    async updateVenue(id, data) {

        this.#validateObjectId(id)

        const updatedVenue = await venueRepository.updateVenue(id, data)

        if (!updatedVenue) throw new AppError('Venue not found', 404)

        return updatedVenue
    }

    async deleteVenue(id) {
        this.#validateObjectId(id)

        const deletedVenue = await venueRepository.deleteVenue(id)

        if (!deletedVenue) throw new AppError('Venue not found', 404)

        return deletedVenue
    }

    #validateObjectId(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid venue id', 400)
    }
}

export default new VenueService()