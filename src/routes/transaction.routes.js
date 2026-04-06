const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate")

const ctrl = require("../controllers/transaction.controller");

const { createTransactionValidator, updateTransactionValidator } = require("../validators/transaction.validator");

// Admin only
router.post("/", auth, role("ADMIN"), createTransactionValidator, validate, ctrl.createTransaction);
router.put("/:id", auth, role("ADMIN"), updateTransactionValidator, validate, ctrl.updateTransaction);
router.delete("/:id", auth, role("ADMIN"), ctrl.deleteTransaction);


router.get("/", auth, role("ADMIN", "ANALYST", "VIEWER"), ctrl.getTransactions);

router.put("/restore/:id", auth, role("ADMIN"), ctrl.restoreTransaction);

module.exports = router;