const Hospital = require("../models/Hospital");

const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json({
      success: true,
      data: hospitals,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

const getHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: hospital,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

const createHospital = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({
      success: true,
      data: hospital,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

const updateHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }
    res.status(200).json({
      success: true,
      data: hospital,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

const deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findOneAndDelete(req.params.id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
};
