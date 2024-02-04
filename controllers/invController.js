const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* **************************************
* Build inventory by inventory view
* ************************************ */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInventoryId(inv_id)
  const display = await utilities.buildVehicleDisplay(data)
  let nav = await utilities.getNav()
  const vehicle_name = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/details", {
    title: vehicle_name,
    nav,
    display,
    errors: null,
  })
}

/* **************************************
* Build manager view
* ************************************ */
invCont.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management Control Panel",
    nav,
    errors: null,
  })
}

/* **************************************
* Build add classification view
* ************************************ */
invCont.buildAddClassificationView = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "New Classification",
    nav,
    errors: null,
  })
}

/* **************************************
* Build add inventory view
* ************************************ */
invCont.buildAddInventoryView = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationSelector = await utilities.getClassificationSelector()
  res.render("inventory/add-inventory", {
    title: "New Inventory",
    nav,
    classificationSelector,
    errors: null,
  })
}


/* **************************************
* Add a new classification and handle errors
* ************************************ */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  let nav = await utilities.getNav()
  const regResult = await invModel.addClassificationInfo(
    classification_name
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added ${classification_name} to the site.`
    )
    let nav = await utilities.getNav()
    res.status(201).render("inventory/management", {
      title: "Management Control Panel",
      nav,
      errors: null,
    })
    } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

/* **************************************
* Add a new inventory item and handle errors
* ************************************ */
invCont.addInventory = async function (req, res) {
  const { inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id } = req.body
  let nav = await utilities.getNav()
  const regResult = await invModel.addInventoryInfo(
    inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_price,
          inv_miles,
          inv_color,
          classification_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added ${inv_year + " " + inv_model} to the site.`
    )
    let nav = await utilities.getNav()
    res.status(201).render("inventory/management", {
      title: "Management Control Panel",
      nav,
      errors: null,
    })
    } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
    })
  }
}


module.exports = invCont
