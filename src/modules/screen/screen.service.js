import mongoose from "mongoose"
import AppError from "../../utils/AppError.js"
import screenRepository from "./screen.repository.js"



class ScreenService {
    async createScreen(data) {
        return screenRepository.createScreen(data)
    }

    async getScreenById(id) {
        this.#validateObjectId(id)

        const screen = await screenRepository.findScreenById(id)

        if (!screen) throw new AppError('Screen not found', 404)

        return screen
    }

    async getAllScreens(filters = {}) {
        const { venue_id } = filters

        if (venue_id) {
            const screenExists = await screenRepository.findScreenByVenueId(venue_id)

            if (!screenExists) throw new AppError(`No screen found with this venue`, 404)

            return screenExists
        }

        return screenRepository.findAllScreens()
    }

    async updateScreen(id, data) {

        this.#validateObjectId(id)

        const updatedScreen = await screenRepository.updateScreen(id, data)

        if (!updatedScreen) throw new AppError('Screen not found', 404)

        return updatedScreen
    }

    async deleteScreen(id) {
        this.#validateObjectId(id)

        const deletedScreen = await screenRepository.deleteScreen(id)

        if (!deletedScreen) throw new AppError('Screen not found', 404)

        return deletedScreen
    }

    #validateObjectId(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid screen id', 400)
    }
}

export default new ScreenService()