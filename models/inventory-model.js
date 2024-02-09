const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* **************************************
* Get all the vehicle data by inv_id
* ************************************ */
async function getVehicles() {
  return await pool.query("SELECT * FROM public.inventory ORDER BY inv_id")
}

async function getClassificationId(classification_name) {
  return pool.query(`SELECT * FROM public.classification WHERE classification_name='${classification_name}';`)
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* **************************************
* Get all inventory items by inv_id
* ************************************ */
async function getInventoryByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByInventoryId error " + error)
  }
}

/* *****************************
*   Add new classification
* *************************** */
async function addClassificationInfo(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_id, classification_name) VALUES (DEFAULT, $1) RETURNING *;"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Add new inventory
* *************************** */
async function addInventoryInfo(inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_price,
  inv_miles,
  inv_color,
  classification_id){
  try {
    const image = '/images/vehicles/no-image.png'
    const imagetn = '/images/vehicles/no-image-tn.png'
    const sql = "INSERT INTO inventory VALUES(DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;"
    return await pool.query(sql, [inv_make,
      inv_model,
      inv_year,
      inv_description,
      image,
      imagetn,
      inv_price,
      inv_miles,
      inv_color,
      classification_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Modify inventory
* *************************** */
async function updateInventory(
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
  classification_id){
  try {
    const sql = "UPDATE public.inventory SET inv_make = $2, inv_model = $3, inv_year = $4, inv_description = $5, inv_image = $6, inv_thumbnail = $7, inv_price = $8, inv_miles = $9, inv_color = $10, classification_id = $11 WHERE inv_id = $1 RETURNING *;"
    return await pool.query(sql, [
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
      classification_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   DELETE inventory
* *************************** */
async function deleteItem(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1;"
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
    return error
  }
}


module.exports = {getClassifications, getVehicles, getInventoryByClassificationId, getInventoryByInventoryId, addClassificationInfo, addInventoryInfo, updateInventory, deleteItem };
