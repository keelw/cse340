// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by details view
router.get("/details/:invId", invController.buildByInventoryId);

// Route to build the manager view
router.get("/management/", invController.buildManagementView);

// Route to build the new classification view
router.get("/add-classification", invController.buildAddClassificationView)

// Route to add new classification from form and validate
router.post(
    "/add-classification",
    regValidate.classificationRules(),
    regValidate.checkRegDataClassification,
    utilities.handleErrors(invController.addClassification)
  )

// Route to build the new inventory view
router.get("/add-inventory", invController.buildAddInventoryView)

// Route to add new inventory from form and validate
router.post(
    "/add-inventory",
    regValidate.inventoryRules(),
    regValidate.checkRegDataInventory,
    utilities.handleErrors(invController.addInventory)
)

module.exports = router;
