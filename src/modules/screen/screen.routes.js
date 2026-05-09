import { Router } from "express";
import { createScreen, deletedScreen, getAllScreens, getScreenById, updateScreen } from "./screen.controller.js";



const screenRouter = Router()

screenRouter
    .route('/')
    .post(createScreen)
    .get(getAllScreens)

screenRouter
    .route('/:id')
    .get(getScreenById)
    .patch(updateScreen)
    .delete(deletedScreen)

export default screenRouter