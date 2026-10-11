const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const firewallService = require("../services/firewall.service");

const check = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const result = await firewallService.checkFirewall({
    text: req.body.text,
    context: req.body.context || {},
    userId,
  });
  return ApiResponse.success(res, "Firewall assessment completed", result);
});

module.exports = {
  check,
};
