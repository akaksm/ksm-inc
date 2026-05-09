import mongoose from "mongoose"
import AppError from "../../utils/AppError.js"
import Screen from "./screen.model.js"
import { createScreen, deleteScreen, findAllScreens, findScreenById, findScreenByVenueId, updateScreen } from "./screen.repository.js"



class ScreenService {
    async createScreen(data) {
        const { venue_id, name, screen_type } = data

        if (!venue_id || !name || !screen_type) throw new AppError('One or more field cannot be empty', 400)

        return createScreen(data)
    }

    async getScreenById(id) {
        this.#validateObjectId(id)

        const screen = await findScreenById(id)

        if (!screen) throw new AppError('Screen not found', 404)

        return screen
    }

    async getAllScreens(filters = {}) {
        const { venue_id } = filters

        if (venue_id) {
            const screenExists = await Screen.exists({ venue_id })

            if (!screenExists) throw new AppError(`No screen found with this venue`, 404)

            return await findScreenByVenueId(venue_id)
        }

        return findAllScreens()
    }

    async updateScreen(id, data) {

        this.#validateObjectId(id)

        const updatedScreen = await updateScreen(id, data)

        if (!updatedScreen) throw new AppError('Screen not found', 404)

        return updatedScreen
    }

    async deleteScreen(id) {
        this.#validateObjectId(id)

        const deletedScreen = await deleteScreen(id)

        if (!deletedScreen) throw new AppError('Screen not found', 404)

        return deletedScreen
    }

    #validateObjectId(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid screen id', 400)
    }
}

export default new ScreenService()