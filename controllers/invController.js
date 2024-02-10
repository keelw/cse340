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
  // let headerLink = await utilities.doHeader(req, res)
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    // headerLink,
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
  // let headerLink = await utilities.doHeader(req, res)
  let nav = await utilities.getNav()
  const vehicle_name = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/details", {
    title: vehicle_name,
    // headerLink,
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
  const classificationSelector = await utilities.getClassificationSelector()
  res.render("./inventory/management", {
    title: "Management Control Panel",
    nav,
    // headerLink,
    errors: null,
    classificationSelector,
  })
}

/* **************************************
* Build add classification view
* ************************************ */
invCont.buildAddClassificationView = async function (req, res, next) {
  const nav = await utilities.getNav()
  // let headerLink = await utilities.doHeader(req, res)
  res.render("inventory/add-classification", {
    title: "New Classification",
    nav,
    // headerLink,
    errors: null,
  })
}

/* **************************************
* Build add inventory view
* ************************************ */
invCont.buildAddInventoryView = async function (req, res, next) {
  const nav = await utilities.getNav()
  // let headerLink = await utilities.doHeader(req, res)
  const classificationSelector = await utilities.getClassificationSelector()
  res.render("inventory/add-inventory", {
    title: "New Inventory",
    // headerLink,
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
  // let headerLink = await utilities.doHeader(req, res)
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
      // headerLink,
      nav,
      errors: null,
    })
    } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      // headerLink,
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
  // let headerLink = await utilities.doHeader(req, res)
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
    res.redirect("/inv/")
    } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      // headerLink,
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build the modify inventory view
 * ************************** */
invCont.modifyInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const nav = await utilities.getNav()
  // let headerLink = await utilities.doHeader(req, res)
  const invData = await invModel.getInventoryByInventoryId(inv_id)
  const classificationSelector = await utilities.getClassificationSelector(invData.classification_id)
  const itemName = `${invData[0].inv_make} ${invData[0].inv_model}`
  console.log(invData[0])
  res.render("inventory/modify-inventory", {
    title: "Modify " + itemName,
    // headerLink,
    nav,
    inv_id: invData[0].inv_id,
    inv_make: invData[0].inv_make,
    inv_model: invData[0].inv_model,
    inv_year: invData[0].inv_year,
    inv_description: invData[0].inv_description,
    inv_image: invData[0].inv_image,
    inv_thumbnail: invData[0].inv_thumbnail,
    inv_price: invData[0].inv_price,
    inv_miles: invData[0].inv_miles,
    inv_color: invData[0].inv_color,
    classification_id: invData[0].classification_id,
    classificationSelector,
    errors: null,
  })
}

/* **************************************
* Update Inventory Item and Handle errors
* ************************************ */
invCont.updateInventory = async function (req, res) {
  const { inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id } = req.body
  let nav = await utilities.getNav()
  // let headerLink = await utilities.doHeader(req, res)
  const updateResult = await invModel.updateInventory(
          inv_id,
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_miles,
          inv_color,
          classification_id
  )

  const invData = await invModel.getInventoryByInventoryId(inv_id)
  const itemName = `${invData[0].inv_make} ${invData[0].inv_model}`
  if (updateResult) {
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
    } else {
    const invData = await invModel.getInventoryByInventoryId(inv_id)
    const itemName = `${invData[0].inv_make} ${invData[0].inv_model}`
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/modify-inventory", {
      title: "Modify " + itemName,
      // headerLink,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
      })
    }
}

/* ***************************
 *  Build the delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const nav = await utilities.getNav()
  // let headerLink = await utilities.doHeader(req, res)
  const invData = await invModel.getInventoryByInventoryId(inv_id)
  const itemName = `${invData[0].inv_make} ${invData[0].inv_model}`
  res.render("inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    // headerLink,
    inv_id: invData[0].inv_id,
    inv_make: invData[0].inv_make,
    inv_model: invData[0].inv_model,
    inv_year: invData[0].inv_year,
    inv_price: invData[0].inv_price,
    inv_miles: invData[0].inv_miles,
    errors: null,
  })
}

/* **************************************
* Delete Inventory Item and Handle errors
* ************************************ */
invCont.deleteInventory = async function (req, res) {
    const inv_id = parseInt(req.body.inv_id)
    console.log(inv_id)
    let nav = await utilities.getNav()
    // let headerLink = await utilities.doHeader(req, res)
    const invData = await invModel.getInventoryByInventoryId(inv_id)
    const itemName = `${invData[0].inv_make} ${invData[0].inv_model}`

    const deleteItem = await invModel.deleteItem(inv_id)

    if (deleteItem) {
      req.flash("notice", `The ${itemName} was successfully deleted.`)
      res.redirect("/inv/")
      } else {
      req.flash("notice", "Sorry, the DELETE failed.")
      res.status(501).render("/inv/", {
      title: "Modify " + itemName,
        // headerLink,
      nav,
      errors: null,
      })
    }
}


module.exports = invCont
