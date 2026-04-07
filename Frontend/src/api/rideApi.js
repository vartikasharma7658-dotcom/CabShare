import API from "../utils/api";

// GET all rides
export const getRides = () => API.get("/rides");

// CREATE ride
export const createRide = (data) => API.post("/rides", data);