// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route to build account login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to submit the registration form and validate
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )
// Exports
module.exports = router;
