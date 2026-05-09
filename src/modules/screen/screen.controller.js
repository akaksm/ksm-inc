import ScreenService from './screen.service.js'
import AppResponse from '../../utils/AppResponse.js'

// POST /screens
export const createScreen = async (req, res) => {
    const screen = await ScreenService.createScreen(req.body)

    return res.status(201).json(new AppResponse('Screen created', screen))
}

// GET /screens
export const getAllScreens = async (req, res) => {
    const screens = await ScreenService.getAllScreens(req.query)
    const count = screens.length
    const message = count === 1 ? `Screen found` : `${count} screens found`
    return res.status(200).json(new AppResponse(message, screens))
}

// GET /screens/:id 
export const getScreenById = async (req, res) => {
    const screen = await ScreenService.getScreenById(req.params.id)

    return res.status(200).json(new AppResponse(`Screen found`, screen))
}

// PATCH /screens/:id
export const updateScreen = async (req, res) => {
    const updatedScreen = await ScreenService.updateScreen(req.params.id, req.body)

    return res.status(200).json(new AppResponse('Screen updated successfully', updatedScreen))
}

// DELETE /screens/:id
export const deletedScreen = async (req, res) => {
    const deletedScreen = await ScreenService.deletedScreen(req.params.id)

    return res.status(200).json(new AppResponse('screen deleted successfully', deletedScreen))
}