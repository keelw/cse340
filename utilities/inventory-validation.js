const utilities = require(".")
const { body, validationResult} = require("express-validator")
const invModel = require("../models/inventory-model")
// create express validator object
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        // classification is required and must be a string and cannot 
        // special characters or spaces
        body("classification_name")
            .trim()
            .isLength({min: 1})
            .isAlphanumeric()
            .custom(value => !/\s/.test(value))
            .withMessage("Please provide a valid classification name.")
    ]
}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        // classification is required and must be a string and cannot 
        // special characters or spaces
        body("inv_make")
            .trim()
            .isLength({min: 1})
            .isAlphanumeric()
            .withMessage("Please provide a valid string for vehicle make."),

        body("inv_model")
            .trim()
            .isLength({min: 1})
            .isAlphanumeric()
            .withMessage("Please provide a valid string for vehicle model."),

        body("inv_year")
            .trim()
            .isLength({min: 1})
            .isInt({ min: 1900, max: 2050})
            .withMessage("Please provide a valid string for vehicle model."),

        body("inv_description")
            .trim(),

        body("inv_price")
            .trim()
            .isAlphanumeric()
            .isInt({ min: 1, max: 1000000000})
            .withMessage("Please provide a valid value for the vehicle price. "),

        body("inv_miles")
            .trim()
            .isAlphanumeric()
            .isInt({ min: 1, max: 1000000000})
            .withMessage("Please provide a valid value for the vehicle miles. "),

        body("inv_color")
            .trim()
            .isLength({min: 1})
            .isAlphanumeric()
            .withMessage("Please provide a valid string for vehicle color."),

    ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inv/management", {
        errors,
        title: "Adding Classification",
        nav,
        classification_name
    })
      return
    }
    next()
  }
  
  module.exports = validate