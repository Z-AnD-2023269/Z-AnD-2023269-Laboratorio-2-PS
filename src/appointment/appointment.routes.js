import { Router } from "express";
import { saveAppointment,  listUserAppointments, updateAppointment, cancelAppointment } from "./appointment.controller.js";
import { createAppointmentValidator } from "../middlewares/appointment-validators.js";

const router = Router();

router.post("/createAppointment", createAppointmentValidator, saveAppointment);

router.get("/findAppointment/:userId", listUserAppointments);

router.put("/updateAppointment/:appointmentId", updateAppointment);

router.patch("/Cancelar/:appointmentId", cancelAppointment);

export default router;
