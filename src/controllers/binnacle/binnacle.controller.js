import prisma from "../../../prisma/prismaClient.js";
import {getVaccinations} from "../vaccinations/vaccinations.controller.js";

const getAllBinnacles = async (req, res) => {
    try {

    } catch (error) {
        return res.status(400).json({ message: "No se pudieron obtener "})
    }
}

const createBinnacle = async (req, res) => {}

export default  {
    getVaccinations,
    createBinnacle
}