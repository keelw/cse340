const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/details/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/details/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the details view HTML
* ************************************ */
Util.buildVehicleDisplay = async function(data) {
  let display
  if (data.length > 0) {
    display = '<div id="vehicle-display">'
    display += '<img id="vehicle-details-image" src=" ' + data[0].inv_image + '" ' 
            + 'alt="Image of '+ data[0].inv_make + ' ' + data[0].inv_model 
            +' on CSE Motors">'
    display += '<div class="vehicle-details">'
    display += '<h2>' + data[0].inv_make + ' ' + data[0].inv_model + " Details" + '</h2>'
    display += '<div id="vehicle-details-price"><p>Price: $'
            + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</p></div>'
    display += '<div id="vehicle-details-description"><p>Description: ' + " " + data[0].inv_description + '</p></div>'
    display += '<div id="vehicle-details-color"><p>Color: ' + data[0].inv_color + '</p></div>'
    display += '<div id="vehicle-details-miles"><p>Miles: ' + data[0].inv_miles.toLocaleString() + '</p></div>'
    display += '</div>'
    display += '</div>'
  } else {
    display += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return display
}

/* ************************
 * Constructs the classification selector for adding inventory page
 ************************** */
Util.getClassificationSelector = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let options = `<select id="classificationId" name="classification_id">`
  options += `<option value="" disabled selected hidden>Select One</option>`
  data.rows.forEach((row) => {
    options += `<option value="` + row.classification_id
    options += `">` + row.classification_name + `</option>`
  })
  options += "</select><br>"
  return options
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }
 


module.exports = Util
