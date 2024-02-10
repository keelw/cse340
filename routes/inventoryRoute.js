// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", 
    utilities.checkType,
    invController.buildByClassificationId);

// Route to build inventory by details view
router.get("/details/:invId", 
    utilities.checkType,
    invController.buildByInventoryId);

// Route to build the manager view
router.get(
        "/", 
        utilities.checkLogin,
        utilities.checkJWTToken,
        utilities.checkType,
        invController.buildManagementView);

// Route to build the new classification view
router.get(
    "/add-classification", 
    utilities.checkLogin,
    utilities.checkJWTToken,
    utilities.checkType,
    invController.buildAddClassificationView)

// Route to add new classification from form and validate
router.post(
    "/add-classification",
    regValidate.classificationRules(),
    regValidate.checkRegDataClassification,
    utilities.handleErrors(invController.addClassification)
  )

// Route to build the new inventory view
router.get(
    "/add-inventory", 
    utilities.checkLogin,
    utilities.checkJWTToken,
    utilities.checkType,
    invController.buildAddInventoryView)

// Route to add new inventory from form and validate
router.post(
    "/add-inventory",
    regValidate.inventoryRules(),
    regValidate.checkRegDataInventory,
    utilities.handleErrors(invController.addInventory)
)

// Route to get the URL for the manager view
router.get("/getInventory/:classification_id", 
    utilities.checkType,
    utilities.handleErrors(invController.getInventoryJSON))

// Route to build the modify inventory from 
router.get(
    "/edit/:inv_id", 
    utilities.checkLogin,
    utilities.checkJWTToken,
    utilities.checkType,
    utilities.handleErrors(invController.modifyInventory))

// Route to actually modify the inventory items
router.post(
    "/modify-inventory/",
    regValidate.inventoryRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Route to display the delete inventory view
router.get(
    "/delete/:inv_id", 
    utilities.checkLogin,
    utilities.checkJWTToken,
    utilities.checkType,
    utilities.handleErrors(invController.deleteInventoryView))

// Route to delete the inventory items
router.post(
    "/delete-inventory/",
    regValidate.inventoryRules(),
    utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;
