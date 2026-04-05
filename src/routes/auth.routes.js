const router = require("express").Router();
const ctrl = require("../controllers/auth.controller");

const { loginLimiter } = require("../middleware/rateLimiter");

const validate = require("../middleware/validate");
const { registerValidator, loginValidator } = require("../validators/auth.validator");

router.post("/register", registerValidator, validate, ctrl.register);
router.post("/login", loginLimiter, loginValidator, validate, ctrl.login);


module.exports = router;