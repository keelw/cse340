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
            .withMessage("Please provide a valid classification name.")
    ]
}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .isLength({min: 1})
            .withMessage("Please provide a valid string for vehicle make."),

        body("inv_model")
            .trim()
            .isLength({min: 1})
            .withMessage("Please provide a valid string for vehicle model."),

        body("inv_year")
            .trim()
            .isLength({min: 1})
            .isInt({ min: 1900, max: 2050})
            .withMessage("Please provide a year for this vehicle (must be after 1900)."),

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
            .withMessage("Please provide a valid string for vehicle color."),
    ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkRegDataClassification = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Adding Classification",
        nav,
        classification_name
    })
      return
    }
    next()
  }

  /* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkRegDataInventory = async (req, res, next) => {
    const { inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_price,
        inv_miles,
        inv_color,
        classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classificationSelector = await utilities.getClassificationSelector()
      res.render("inventory/add-inventory", {
        errors,
        title: "Adding Inventory",
        nav,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
        classificationSelector
    })
      return
    }
    next()
  }

/* ******************************
 * Check data and return errors or continue to modify inventory
   Errors will be redirected back to the edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { 
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
         } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classificationSelector = await utilities.getClassificationSelector()
      const invData = await invModel.getInventoryByInventoryId(inv_id)
      const itemName = `${invData[0].inv_make} ${invData[0].inv_model}`
      
      res.render(`/inv/edit/${invData[0].inv_id}`, {
        errors,
        title: "Modify " + itemName,
        nav,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
        classificationSelector,
        inv_id
    })
      return
    }
    next()
  }

  
  module.exports = validate