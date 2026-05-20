import { Router } from "express";
import { createScreen, deleteScreen, getAllScreens, getScreenById, updateScreen } from "./screen.controller.js";



const screenRouter = Router()

screenRouter
    .route('/')
    .post(createScreen)
    .get(getAllScreens)

screenRouter
    .route('/:id')
    .get(getScreenById)
    .patch(updateScreen)
    .delete(deleteScreen)

export default screenRouter