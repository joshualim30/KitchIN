"use strict";
// Version: v2.00.0
// Password.js - Password Hashing Configuration
// Created by: Joshua Lim
// Created on: 11/09/2022
// Last edited by: Joshua Lim
// Last edited on: 09/02/2023
// --
// RESOURCES:
// - https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
// --
// TODO:
// -
// --
// WIKI DOCUMENTATION:
// -
// --

// IMPORTS:
const crypto = require("crypto");
const { pepperPassword } = require("./Crypto");
const { kitchinError } = require("./Errors");

// PUBLIC FUNCTIONS:
// (PH) - Password Hashing
// (CALL) - password.hashPassword(password).then((salt, hash) => { }).catch((err) => { });
// Body:
// - password
async function hashPassword(password) { // DONE

	return new Promise((resolve, reject) => {

		// Set salt variable
		let s = null;

		// Validating the Password
		validatePassword(password).then((valid) => {

			// If the Password is not valid
			if (!valid)
				return reject(false);

			// Generating a Salt for end of the Password (32 Characters)
			return generateSalt(8);
            
		}).then((salt) => {

			// Set the Salt
			s = salt;

			// Add the Salt to the Password
			let fullPassword = password + "." + salt;

			// Salting the Password
			let salted = crypto.pbkdf2Sync(fullPassword, salt, 1000, 75, "sha512").toString("hex");

			// Pepper the Hash
			return pepperPassword(salted, salt, "encrypt", "latest");
            
		}).then(({ password, version }) => {

			// Returning the Hashed Password
			return resolve({ hash: password, salt: s, version: version });

		}).catch((err) => {
			kitchinError("PH", 400, err, "Password Hashing Failed", null, null);
			return reject(err);
		});

	});

}

// (PV) - Password Verification
// (CALL) - password.verifyPassword(password, salt, hash).then((verified) => { }).catch((err) => { });
// Body:
// - password
// - salt
// - hash
async function verifyPassword(password, salt, hash, version) { // DONE

	return new Promise((resolve, reject) => {

		// Validating the Password
		validatePassword(password).then((valid) => {

			// If the Password is not valid
			if (!valid)
				return reject(false);

			// Decrypt the Hash
			return pepperPassword(hash, salt, "decrypt", version);
            
		}).then(({ password: unpeppered, version: version }) => {

			// Add the Salt to the Password
			let fullPassword = password + "." + salt;

			// Verify fullPassword with the Hash
			let verify = crypto.pbkdf2Sync(fullPassword, salt, 1000, 75, "sha512").toString("hex");

			// Return the Verification
			if (verify == unpeppered)
				return resolve(true);
			else
				return resolve(false);

		}).catch((err) => {
			kitchinError("VP", 400, err, "Password Verification Failed", null, null);
			return resolve(false);
		});

	});

}

// PRIVATE FUNCTIONS:
// (PSG) - Password Salt Generation
// (CALL) - generateSalt(length);
// Body:
// - length
function generateSalt(length) { // DONE

	// Return a Promise
	return new Promise((resolve, reject) => {

		// Generating the Salt
		let salt = crypto.randomBytes(length).toString("hex");

		// Returning the Salt
		resolve(salt);
        
	});

}

// (PV) - Password Validation
// (CALL) - validatePassword(password);
// Body:
// - password
function validatePassword(password) { // DONE

	// Return a Promise
	return new Promise((resolve, reject) => {

		// Regex for Password Validation
		const regex = /^.*(?=.{8,20})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=?!]).*$/;

		// Verify that the password is valid
		if (!regex.test(password))
			reject(false);
		else
			resolve(true);
        
	});

}

// EXPORTS:
module.exports = { hashPassword, verifyPassword };