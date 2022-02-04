const getHospitals = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: "Show all hospitals",
  });
};

const getHospital = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: `Show hospital ${req.params.id}`,
  });
};

const createHospital = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: `Create new hospitals`,
  });
};

const updateHospital = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: `Update hospital ${req.params.id}`,
  });
};

const deleteHospital = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: `Delete hospital ${req.params.id}`,
  });
};

module.exports = {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
};
