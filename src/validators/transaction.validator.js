const {body} = require("express-validator");

exports.createTransactionValidator = [
    body("amount")
        .notEmpty().withMessage("Amount is required")
        .isNumeric().withMessage("Amount must be a number")
        .custom(value => value > 0).withMessage("Amount must be greater than 0"),
        
    body("type")
        .notEmpty().withMessage("Type is required")
        .customSanitizer(value => value.toUpperCase())
        .isIn(["INCOME", "EXPENSE"]).withMessage("Invalid type")
        .withMessage("Type must be INCOME or EXPENSE"),
        
    body("category")
        .notEmpty().withMessage("Category is required"),
    
    body("userId")
        .notEmpty().withMessage("userId is required")
        .isMongoId().withMessage("Invalid userId")

        
];
    

exports.updateTransactionValidator = [
  body("amount")
    .optional()
    .isFloat({ gt: 0 }).withMessage("Amount must be a number greater than 0"),

  body("type")
    .optional()
    .custom(value => value.toUpperCase())
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Type must be INCOME or EXPENSE"),

  body("category")
    .optional()
    .trim()
    .notEmpty().withMessage("Category cannot be empty"),

  body("notes")
    .optional()
    .trim()
];