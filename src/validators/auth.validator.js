const {body} = require("express-validator");

exports.registerValidator = [
    body("name")
        .notEmpty().withMessage("Name is required"),
    body("email")
        .isEmail().withMessage("Valid email is required"),
    body("password")
        .isLength({min: 6}).withMessage("Password must be atleast 6 characters"),
    body("role")
        .optional()
        .isIn(["VIEWER", "ANALYST", "ADMIN"])
        .withMessage("Invalid role")

];

exports.loginValidator =[
    body("email")
        .isEmail()
        .withMessage("Valid email is required"),
    body("password")
        .notEmpty()
];