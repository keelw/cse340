// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route to build account login view
router.get("/login", 
  utilities.checkType,
  utilities.handleErrors(accountController.buildLogin));

// Route to build the registration view
router.get("/register", 
  utilities.checkType,
  utilities.handleErrors(accountController.buildRegister));

// Route to submit the registration form and validate
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route to build the account management view
router.get(
  "/accountManager", 
  utilities.checkLogin,
  utilities.checkJWTToken,
  utilities.checkType,
  utilities.handleErrors(accountController.buildAccountManager));

// Route to build the update view
router.get(
  "/update",
  utilities.checkType,
  utilities.handleErrors(accountController.buildAccountUpdate))

// Route to process the account information updates
router.post(
  "/account-update",
  regValidate.registationUpdateRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.updateAccount)
)

// Route to process the account password updates
router.post(
  "/password-update",
  regValidate.updatePasswordRules(),
  utilities.handleErrors(accountController.updatePassword)
)

// Route to process the logout 
router.get(
  "/logout",
  utilities.handleErrors(accountController.logout)
)

// Exports
module.exports = router;
