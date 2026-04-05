const router = require("express").Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const ctrl = require("../controllers/user.controller");

const validate = require("../middleware/validate");
const { updateUserValidator } = require("../validators/user.validator");

router.get("/", auth, role("ADMIN"), ctrl.getAllUsers);
router.put("/:id", auth, role("ADMIN"), updateUserValidator, validate, ctrl.updateUser);

router.delete("/:id", auth, role("ADMIN"), ctrl.deleteUser);

module.exports = router;