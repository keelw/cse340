const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  // let headerLink = await utilities.doHeader
  res.render("index", {title: "Home", 
  //headerLink, 
  nav})
}

module.exports = baseController
