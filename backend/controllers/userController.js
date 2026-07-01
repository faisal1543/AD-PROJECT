const UserModel = require("../models/userModel");

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    return res.json({
      success: true,
      user: UserModel.format(user)
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while loading profile."
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const affectedRows = await UserModel.update(userId, req.body);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const updatedUser = await UserModel.findById(userId);

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      user: UserModel.format(updatedUser)
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating profile."
    });
  }
};