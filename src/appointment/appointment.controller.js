import Pet from "../pet/pet.model.js";
import Appointment from "../appointment/appointment.model.js";
import { parse } from "date-fns";

export const saveAppointment = async (req, res) => {
  try {
    const data = req.body;

    const isoDate = new Date(data.date);

    if (isNaN(isoDate.getTime())) {
      return res.status(400).json({
        success: false,
        msg: "Fecha inválida",
      });
    }

    const pet = await Pet.findOne({ _id: data.pet });
    if (!pet) {
      return res.status(404).json({ 
        success: false, 
        msg: "No se encontró la mascota" 
      });
    }

    const existAppointment = await Appointment.findOne({
      pet: data.pet,
      user: data.user,
      date: {
        $gte: new Date(isoDate).setHours(0, 0, 0, 0),
        $lt: new Date(isoDate).setHours(23, 59, 59, 999),
      },
    });

    if (existAppointment) {
      return res.status(400).json({
        success: false,
        msg: "El usuario y la mascota ya tienen una cita para este día",
      });
    }

    const appointment = new Appointment({ ...data, date: isoDate });
    await appointment.save();

    return res.status(200).json({
      success: true,
      msg: `Cita creada exitosamente en fecha ${data.date}`,
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      msg: "Error al crear la cita", 
      error 
    });
  }
};

export const listUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params; // Obtener el ID del usuario de los parámetros

    const appointments = await Appointment.find({ user: userId }).populate('pet', 'name'); // Poblar con la información de la mascota

    if (!appointments.length) {
      return res.status(404).json({
        success: false,
        msg: "No se encontraron citas para este usuario",
      });
    }

    return res.status(200).json({
      success: true,
      appointments,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Error al obtener las citas",
      error,
    });
  }
}

export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const data = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        msg: "Cita no encontrada",
      });
    }

    const isoDate = new Date(data.date);
    if (isNaN(isoDate.getTime())) {
      return res.status(400).json({
        success: false,
        msg: "Fecha inválida",
      });
    }

    appointment.date = isoDate;
    appointment.pet = data.pet || appointment.pet;
    appointment.user = data.user || appointment.user;

    await appointment.save();

    return res.status(200).json({
      success: true,
      msg: "Cita actualizada exitosamente",
      appointment,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Error al actualizar la cita",
      error,
    });
  }
}

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        msg: "Cita no encontrada",
      });
    }

    appointment.status = "CANCELLED";
    await appointment.save();

    return res.status(200).json({
      success: true,
      msg: "Cita cancelada exitosamente",
      appointment,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Error al cancelar la cita",
      error,
    });
  }
}
