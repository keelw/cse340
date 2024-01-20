-- Task01 `Tony Stark`

-- Step01
INSERT INTO account 
	(account_id, account_firstname, account_lastname, account_email, account_password, account_type)
VALUES 
	(DEFAULT, 'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n', DEFAULT);

-- Step02
UPDATE account 
SET account_type = 'Admin'
WHERE account_id = 1;

-- Step03
DELETE FROM account
	WHERE account_id = 1;

-- Step04
UPDATE
	inventory
SET
	inv_description = REPLACE(
		inv_description, 
		'small interiors', 
		'a huge interior')
WHERE inv_id = 10;

-- Step05
SELECT 
	inv_make, inv_model
FROM 
	classification c
INNER JOIN inventory i
	ON c.classification_id = i.classification_id
WHERE c.classification_name = 'Sport';

-- Step06
UPDATE
	inventory
SET
	inv_image = REPLACE(
		inv_image, 
		'/images/', 
		'/images/vehicles/'),
	inv_thumbnail = REPLACE(
		inv_thumbnail,
		'/images/',
		'/images/vehicles/');

