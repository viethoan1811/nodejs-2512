var jwt = require("jsonwebtoken");
const configs = require("../helper/configs");
const responseData = require("../helper/responseData");

module.exports = {
  checkLogin: async function (req) {
    var result = {};
    var token = req.headers.authorization;
    if (!token) {
      result.err = "Vui long dang nhap";
    } else if (token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      try {
        var userID = await jwt.verify(token, configs.SECRET_KEY);
        return userID.id;
      } catch (error) {
        result.err = "Vui long dang nhap";
      }
    } else {
      result.err = "Vui long dang nhap";
    }
    return result;
  },

  checkRole: async function (req, res, next, allowedRoles) {
    try {
      var userID = await this.checkLogin(req);
      if (userID) {
        var user = await modelUser.getOne(userID);
        var role = user.role;
        console.log(role);
        if (allowedRoles.includes(role)) {
          next();
        } else {
          responseData.responseReturn(res, 403, true, "ban khong du quyen");
        }
      } else {
        responseData.responseReturn(res, 403, true, "Vui long dang nhap");
      }
    } catch (error) {
      console.error("Error in checkRole:", error);
      responseData.responseReturn(res, 500, false, "Internal Server Error");
    }
  },
};
