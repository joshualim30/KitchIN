"use strict";
// Version v2.00.0
// Session.js - Session Middleware
// Created by: Joshua Lim
// Created on: 01/13/2021
// Last edited by: Joshua Lim
// Last edited on: 09/06/2023
// --
// RESOURCES:
// - https://www.npmjs.com/package/jsonwebtoken
// --
// TODO:
// - Test encrypted tokens
// --
// WIKI DOCUMENTATION:
// -
// --

// IMPORTS:
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { verifyPassword } = require("./Password");
const { requestPublicKey, requestPrivateKey } = require("../backend/config/Secret");
const { jwtEncryption } = require("./Crypto"); // ATTEMPT TO ENCRYPT THE JWT
const { kitchinError } = require("./Errors");
const Account = require("../backend/models/Account");

// PUBLIC FUNCTIONS:
// (IT) Issue Token - Issues a Session Token to the Account
// (MID) - Middleware
// Headers:
// - c-user-agent
// - c-authentication
// - c-device-id
// - c-from
async function issueToken(req, res) {

	// Return a promise
	return new Promise((resolve, reject) => {

		// Get all the headers
		const headers = req.headers;
		const username = headers["x-from"];
		const password = headers["x-authentication"];
		const device_id = headers["x-device-id"];

		// Set beta & dev flag
		let beta = req.originalUrl.includes("/api/v2/dev") || req.originalUrl.includes("/api/v2/beta");
		let dev = req.originalUrl.includes("/api/v2/dev");

		// Set version global var
		let v = null;

		// Verify user-agent
		// TODO: Verify user-agent, by parsing
		if (headers["user-agent"] == null)
			throw { code: "IT.1", status: 401, error: new Error("No user-agent provided"), message: "Invalid request" };

		// Find the account in the database
		Account.findOne({ email: username }).then((account) => {

			// Check if account exists
			if (!account) {

				// If account does not exist, check if it is a signup request
				if (!req.originalUrl.includes("/account/signup"))
				// If it is not a signup request, return error
					throw { code: "IT.2", status: 404, error: new Error("No account found with the following email: " + username), message: "Account does not exist" };
				else // If it is a signup request, create a new account (bypass true)
					return true;

			}

			// Account exists, verify originalUrl
			if (!req.originalUrl.includes("/account/signin") && !req.originalUrl.includes("/account/loadin"))
				throw { code: "IT.3", status: 404, error: new Error("No account found with the following email: " + username), message: "Account does not exist" };
                
			// Verify that device ID is correct
			if (account.device_id != device_id && !req.originalUrl.includes("/account/signin"))
				throw { code: "IT.4", status: 401, error: new Error("Invalid device ID for the following account: " + username), message: "Invalid device ID" };
                
			// Set beta & dev flag based on account
			beta = account.beta;
			dev = account.dev;

			// Verify password
			return verifyPassword(password, account.password.salt, account.password.hash, account.password.encrypted_version);

		}).then((result) => {

			// Verify that the password is correct
			if (!result)
				throw { code: "IT.5", status: 401, error: new Error("Incorrect password '" + password + "' for the following account: " + username), message: "Incorrect password" };
                
			// Fetch private key
			return requestPrivateKey();

		}).then(({ key, version }) => {

			// Set version
			v = version;

			// Set audience
			let audience = ["/api/v2/release/*"];

			// Push beta channels
			if (beta)
				audience.push("/api/v2/beta/*");

			// Push dev channels
			if (dev)
				audience.push("/api/v2/dev/*");

			// Generate a new token
			return generateToken(version, key, username, audience);

		}).then(({ token, id }) => {

			// Symmetrically encrypt the token
			return jwtEncryption(token, id, "encrypt");

		}).then(({ token, id, version }) => {

			// TODO: Set the token?
			// res.setHeader('c-bearer', token);

			// Return the token
			return resolve({ id: id, token: token, asymmetric: v, symmetric: version });

		}).catch((err) => {
			return reject(kitchinError(err.code, err.status, err.error, err.message, req, res, true));
		});

	});

}

// (VT) Verify Token - Verifies the Token with the Intended Account
// (MID) - Middleware
// Headers:
// - c-user-agent
// - c-authentication
// - c-device-id
// - c-bearer
// - c-from
async function verifyToken(req, res, next) {

	// Get all the headers
	const headers = req.headers;
	let username = null;
	let password = headers["x-authentication"];
	let device_id = null;
	let token = headers["x-bearer"];

	console.log("1")

	let web = false;

	if(headers['x-user-agent'] == null){
		return kitchinError("VT.1", 401, new Error("No user-agent provided"), "Invalid request", req, res, true);
	}

	console.log("2")

	if(headers['x-user-agent'].includes("Mozilla") || headers['x-user-agent'].includes("Postman") || headers['x-user-agent'].includes("Chrome") || headers['x-user-agent'].includes("Safari") || headers['x-user-agent'].includes("Edge")){
		username = req.cookies["x-user"];
		token = req.cookies["x-bearer"];
		device_id = req.cookies["x-device-id"];

		web = true;
	}else{
		username = headers["x-from"];
		password = headers["x-authentication"];
		device_id = headers["x-device-id"];
		token = headers["x-bearer"];
	}

	console.log("3")

	// Set global variable
	let jwtid = null;
	let jwtversion = null;
	let jwtencryption = null;
	let audience = null;
	let globalAccount = null;
	let deviceBody = null;
    
	// Verify user-agent
	if (headers["x-user-agent"] == null)
	return kitchinError("VT.1", 401, new Error("No user-agent provided"), "Invalid request", req, res, true);

	// Find the account in the database
	Account.findOne({ email: username }).then((account) => {

		console.log("4")

		// Verify that the account exists
		if (!account)
			throw { code: "VT.2", status: 404, error: new Error("No account found with the following email: " + username), message: "Account does not exist" };

		// Set global account
		globalAccount = account;

		let foundDevice = false;

		for(let i = 0; i < account.authorized_devices.length; i++){

			if(account.authorized_devices[i].device_id == device_id){
				foundDevice = true;
				deviceBody = account.authorized_devices[i];
				break;
			}

		}

		console.log("5")

		if(!foundDevice)
			throw { code: "VT.2.1", status: 404, error: new Error("No device found with the following device ID: " + device_id), message: "Device does not exist" };
        
		// Set jwtid & jwtversion
		jwtid = deviceBody.token_id;
		jwtversion = deviceBody.encrypted_versions.asymmetric;
		jwtencryption = deviceBody.encrypted_versions.symmetric;

		// Set audience
		audience = ["/api/v2/release/*"];

		// Push beta channels
		if (account.beta)
			audience.push("/api/v2/beta/*");

		// Push dev channels
		if (account.dev)
			audience.push("/api/v2/dev/*");

		if(web){
			return Promise.resolve();
		}

		console.log("6")

		// Verify password
		return verifyPassword(password, account.password.salt, account.password.hash, account.password.encrypted_version);

	}).then((result) => {

		console.log("7")

		if(web){
			return jwtEncryption(token, jwtid, "decrypt", jwtencryption).catch((err) => {
				throw { code: "VT.4.1", status: 401, error: new Error("Failed to decrypt token for the following account: " + username), message: "Invalid token" };
			});
		}

		// Verify that the password is correct
		if (!result)
			throw { code: "VT.4", status: 401, error: new Error("Incorrect password '" + password + "' for the following account: " + username), message: "Incorrect password" };

		// Decypt the token
		return jwtEncryption(token, jwtid, "decrypt", jwtencryption).catch((err) => {
			throw { code: "VT.4.1", status: 401, error: new Error("Failed to decrypt token for the following account: " + username), message: "Invalid token" };
		});

	}).then(({ token: decrypted, id }) => {

		// Verify token and id match
		if (id != jwtid || decrypted == null)
			throw { code: "VT.5", status: 401, error: new Error("Invalid token for the following account: " + username), message: "Invalid token" };
        
		// Overwrite the token
		token = decrypted;

		// Get public key
		return requestPublicKey(jwtversion); // May not work, may have to set in Account object

	}).then(({ key, version }) => {

		// Make sure public key and version are not null
		if (!key || !version)
			throw { code: "VT.6", status: 500, error: new Error("Failed to fetch public key from Google Secret Manager"), message: "Internal Server Error" };
        
		// Verify token signature
		return jwt.verify(token, key, {
			iss: "https://www.crcl.app", // iss
			sub: username, // sub
			aud: audience, // aud
			alg: "RS256" // algorithm
		});

	}).then((err) => {

		// Check for error
		if (err && err.name != undefined) {

			switch (err.name) {
			case "TokenExpiredError":
				if (req.originalUrl.includes("/account/loadin")) {

					issueToken(req, res).then((message, token) => {

						// Set headers
						res.setHeader("c-bearer", token);

						// Return next
						return next();

					}).catch((err) => {
						throw { code: "VT.7", status: 500, error: err, message: "Internal Server Error" };
					});

				} else {
					throw { code: "VT.8", status: 401, error: err, message: "Session expired" };
				}
			case "JsonWebTokenError":
				throw { code: "VT.9", status: 401, error: err, message: "Invalid session" };
			case "NotBeforeError": // We don't use this, but just in case
				throw { code: "VT.10", status: 401, error: err, message: "Session not valid yet" };
			default:
				throw { code: "VT.11", status: 401, error: err, message: "Invalid session" };

			}

		} else {

			// Verify that they are authorized to access the endpoint - 99% sure this doesn't work
			let isAuthorized = false;
			for (let i = 0; i < audience.length; i++) {

				// Get route & remove the last character
				let route = audience[i].slice(0, -1);

				// Check if the route is in the originalUrl
				if (req.originalUrl.includes(route))
					isAuthorized = true;

			}

			// Verify that they are authorized to access the endpoint
			// if (!isAuthorized)
			// 	throw { code: "VT.12", status: 401, error: new Error("Invalid call for the following account: " + username), message: "Invalid call" };

			if(web){
				req.body.web = true;
			}
                
			// Set the session issued
			return next();

		}

	}).catch((err) => {
		return kitchinError(err.code, err.status, err.error, err.message, req, res, true);
	});

}

// PRIVATE FUNCTIONS:
// (GT) Generate Token
async function generateToken(version, key, subject, audience) {

	// Generate a random token id
	const token_id = crypto.randomBytes(8).toString("hex");

	// Generate the token
	const token = jwt.sign({
		version: version,
	}, key,
	{
		jwtid: token_id, // jti
		issuer: "https://www.crcl.app", // iss
		subject: subject, // sub
		audience: audience, // aud
		expiresIn: "30d", // exp
		algorithm: "RS256" // algorithm
	});

	// Return the token
	return { token: token, id: token_id };

}

// EXPORTS:
module.exports = { issueToken: issueToken, verifyToken: verifyToken };