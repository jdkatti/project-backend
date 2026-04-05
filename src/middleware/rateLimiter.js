const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 4,
    message:{
        success: false,
        message: "Too many login attempts, try again after a minute"
    },
    standardHeaders: true,
    legacyHeaders: false
});