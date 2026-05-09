import AppResponse from "../../utils/AppResponse.js"
import VenueService from "./venue.service.js"


// POST /venues
export const createVenue = async (req, res) => {
    const venue = await VenueService.createVenue(req.body)

    return res.status(201).json(new AppResponse('Venue created successfully', venue))
}

// GET /venues
export const getAllVenues = async (req, res) => {
    const venues = await VenueService.getAllVenues(req.query)
    const count = venues.length
    const message = count === 1 ? `1 Venue found` : `${count} Venues found`
    return res.status(200).json(new AppResponse(message, venues))
}

// GET /venues/:id
export const getVenueById = async (req, res) => {
    const venue = await VenueService.getVenueById(req.params.id)

    return res.status(200).json(new AppResponse(`Venue by id`, venue))
}

// PATCH /venues/:id
export const updateVenue = async (req, res) => {
    const updatedVenue = await VenueService.updateVenue(req.params.id, req.body)

    return res.status(200).json(new AppResponse(`Venue updated successfully`, updatedVenue))
}

// DELETE /venue/:id
export const deletedVenue = async (req, res) => {
    const deletedVenue = await VenueService.deleteVenue(req.params.id)

    return res.status(200).json(new AppResponse(`Venue deleted successfully`, deletedVenue))
}