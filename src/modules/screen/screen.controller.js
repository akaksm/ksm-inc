import ScreenService from './screen.service.js'
import ApiResponse from '../../utils/ApiResponse.js'

// POST /screens
export const createScreen = async (req, res) => {
    const screen = await ScreenService.createScreen(req.body)

    return res.status(201).json(new ApiResponse('Screen created', screen))
}

// GET /screens
export const getAllScreens = async (req, res) => {
    const screens = await ScreenService.getAllScreens(req.query)
    const count = screens.length
    const message = count === 1 ? `Screen found` : `${count} screens found`
    return res.status(200).json(new ApiResponse(message, screens))
}

// GET /screens/:id 
export const getScreenById = async (req, res) => {
    const screen = await ScreenService.getScreenById(req.params.id)

    return res.status(200).json(new ApiResponse(`Screen found`, screen))
}

// PATCH /screens/:id
export const updateScreen = async (req, res) => {
    const updatedScreen = await ScreenService.updateScreen(req.params.id, req.body)

    return res.status(200).json(new ApiResponse('Screen updated successfully', updatedScreen))
}

// DELETE /screens/:id
export const deleteScreen = async (req, res) => {
    const deletedScreen = await ScreenService.deleteScreen(req.params.id)

    return res.status(200).json(new ApiResponse('screen deleted successfully', deletedScreen))
}