const User = require("../models/User");

const register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.log(error.stack);
    res.status(400).json({
      success: false,
    });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  sendTokenResponse(user, 200, res);
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

const getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id, { password: false });
  res.status(200).json({
    success: true,
    data: user,
  });
};

module.exports = {
  login,
  register,
  getMe,
};
