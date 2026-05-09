import { Router } from "express";
import { createVenue, deletedVenue, getAllVenues, getVenueById, updateVenue } from "./venue.controller.js";

const venueRouter = Router()

venueRouter
    .route('/')
    .post(createVenue)
    .get(getAllVenues)

venueRouter
    .route('/:id')
    .get(getVenueById)
    .patch(updateVenue)
    .delete(deletedVenue)

export default venueRouter