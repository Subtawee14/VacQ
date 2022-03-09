const Appointment = require("../models/Appointment");
const Hospital = require("../models/Hospital");

const getAppointments = async (req, res) => {
  let query;
  if (req.user.role !== "admin") {
    query = Appointment.find({ user: req.user.id }).populate({
      path: "hospital",
      select: "name province tel",
    });
  } else {
    query = Appointment.find().populate({
      path: "hospital",
      select: "name province tel",
    });
  }
  try {
    const appointments = await query;
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot find Appointments",
    });
  }
};

const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate({
      path: "hospital",
      select: "name description tel",
    });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No Appointment with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot find Appointment",
    });
  }
};

const addAppointment = async (req, res) => {
  try {
    req.body.hospital = req.params.hospitalId;
    const hospital = await Hospital.findById(req.params.hospitalId);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: `No Hospital with the id of ${req.params.hospitalId}`,
      });
    }
    req.body.user = req.user.id;
    const existedAppointment = await Appointment.find({ user: req.user.id });
    if (existedAppointment.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made 3 appointments`,
      });
    }
    const appointment = await Appointment.create(req.body);
    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot add Appointment",
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No Appointment with the id of ${req.params.id}`,
      });
    }
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this appointment`,
      });
    }
    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot update Appointment",
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No Appointment with the id of ${req.params.id}`,
      });
    }
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this appointment`,
      });
    }
    await appointment.remove();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot delete Appointment",
    });
  }
};

module.exports = {
  getAppointments,
  getAppointment,
  addAppointment,
  updateAppointment,
  deleteAppointment,
};
