const {body} = require("express-validator");

exports.updateUserValidator = [
    body("role")
        .optional()
        .trim()
        .customSanitizer(value => value.toUpperCase())
        .isIn(["VIEWER", "ANALYST", "ADMIN"])
        .withMessage("Invalid role"),
    
    body("status")
        .optional()
        .trim()
        .customSanitizer(value => value.toUpperCase())
        .isIn(["ACTIVE", "INACTIVE"])
        .withMessage("Invalid status")
];