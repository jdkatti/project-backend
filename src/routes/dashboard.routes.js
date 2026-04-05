const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const ctrl = require("../controllers/dashboard.controller");

router.get("/summary", auth, role("VIEWER", "ANALYST", "ADMIN"), ctrl.getSummary);
router.get("/categories", auth, role("ANALYST", "ADMIN"), ctrl.getCategoryTotals);
router.get("/trends", auth, role("ANALYST", "ADMIN"), ctrl.getMonthlyTrends);

router.get("/recent", auth, role("VIEWER", "ANALYST", "ADMIN"), ctrl.getRecentTransactions);

router.get("/monthly-trends", auth, role("VIEWER", "ANALYST", "ADMIN"), ctrl.getMonthlyTrends);

router.get("/category-wise", auth, role("VIEWER", "ANALYST", "ADMIN"), ctrl.getCategoryAnalytics);

module.exports = router;