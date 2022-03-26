const Hospital = require("../models/Hospital");
const vacCenter = require("../models/VacCenter");

const getHospitals = async (req, res) => {
  let query;

  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];

  removeFields.forEach((param) => delete reqQuery[param]);

  console.log(reqQuery);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Hospital.find(JSON.parse(queryStr)).populate("appointments");
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Hospital.countDocuments();
  query = query.skip(startIndex).limit(limit);

  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  try {
    const hospitals = await query;

    res.status(200).json({
      success: true,
      count: hospitals.length,
      pagination,
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
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }
    hospital.remove();

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

const getVacCenters = (req, res, next) => {
  vacCenter.getAll((err, data) => {
    if (err) {
      res.status(500).json({
        success: false,
        message:
          err.message ||
          "Some error occurred while retrieving Vaccine Centers.",
      });
    } else {
      res.send(data);
    }
  });
};

module.exports = {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
  getVacCenters,
};
