"use strict";
// Version: v2.00.0
// Crypto.js - Cryption Middleware
// Created by: Joshua Lim
// Created on: 08/30/2023
// Last edited by: Joshua Lim
// Last edited on: 09/02/2023
// --
// RESOURCES:
// - https://fireship.io/lessons/node-crypto-examples/
// - https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
// - https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#key-lifetimes-and-rotation
// --
// TODO:
// -
// --
// WIKI DOCUMENTATION:
// -
// --

// IMPORTS:
const { randomBytes, createCipheriv, createDecipheriv } = require("crypto");
const NodeRSA = require("node-rsa"); // RSA Encryption
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager"); // Google Secret Manager
const { requestPublicKey, requestPrivateKey, requestSymmetricKey } = require("../backend/config/Secret"); // Secret Manager Configuration
const {kitchinError} = require('./Errors');

// PUBLIC FUNCTIONS:
// (ED) - Encrypt Data
// (CALL) - crypto.encryptData(data).then((encrypted) => { }).catch((err) => { });
// Body:
// - data
// - overrideKey
async function encryptData(data, overrideKey) {

	// Return a promise
	return new Promise((resolve, reject) => {

		// Check if overrideKey is provided
		if (overrideKey) {

			// Create key from overrideKey string payload provided
			const key = new NodeRSA(overrideKey);

			// Encrypt the data
			const cryptic = publicEncrypt(key, Buffer.from(data));

			// Return the encrypted data
			return resolve(cryptic);

		} else {

			// Fetch the public key from Google Secret Manager
			requestPublicKey().then((key) => {

				// Create key from the public key string payload provided by Google Secret Manager
				const publicKey = new NodeRSA(key);

				// Encrypt the data
				const cryptic = publicKey.encrypt(data, "base64"); // base64, utf8

				// Return the encrypted data
				return resolve(cryptic);

			}).catch((err) => {
				kitchinError("ED.1", 500, err, "Internal Server Error", null, null, true);
				return reject("Error fetching public key: " + err);
			});

		}

	});

}

// (DD) - Decrypt Data
// (CALL) - crypto.decryptData(data).then((decrypted) => { }).catch((err) => { });
// Body:
// - data
// - overrideKey
async function decryptData(data, overrideKey) {

	// Return a promise
	return new Promise((resolve, reject) => {

		// Check if overrideKey is provided
		if (overrideKey) {

			// Create key from overrideKey string payload provided
			const key = new NodeRSA(overrideKey);

			// Decrypt the data
			const decrypted = privateDecrypt(key, Buffer.from(data));

			// Return the decrypted data
			return resolve(decrypted);

		} else {

			// Fetch the private key from Google Secret Manager
			requestPrivateKey().then((key) => {

				// Create key from the private key string payload provided by Google Secret Manager
				const privateKey = new NodeRSA(key);

				// Decrypt the data
				const decrypted = privateKey.decrypt(data, "utf8"); // hex, base64, utf8

				// Return the decrypted data
				return resolve(decrypted);

			}).catch((err) => {
				kitchinError("DD.1", 500, err, "Internal Server Error", null, null, true);
				return reject("Error fetching private key: " + err);
			});

		}

	});

}

// (JE) JWT Encryption
// (CALL) - crypto.jwtEncryption(data, key, iv).then((encrypted) => { }).catch((err) => { });
// Body:
// - data (jwt)
// - iv (jwt_id)
// - type (encrypt/decrypt)
async function jwtEncryption(data, iv, type, version) {

	// Return a promise
	return new Promise((resolve, reject) => {

		// Request the symmetric key from Google Secret Manager
		requestSymmetricKey(version ?? "latest").then(({ key, version: keyVersion }) => {

			// Check if type is encrypt or decrypt
			if (type == "encrypt") {

				// Encrypt the data
				let cipher = createCipheriv("aes256", key, iv);
				let encrypted = cipher.update(data, "utf8", "hex");
				encrypted += cipher.final("hex");

				// Return the encrypted data
				return resolve({ token: encrypted, id: iv, version: keyVersion });

			} else {

				// Decrypt the data
				let decipher = createDecipheriv("aes256", key, iv);
				let decrypted = decipher.update(data, "hex", "utf8");
				decrypted += decipher.final("utf8");

				// Return the decrypted data
				return resolve({ token: decrypted, id: iv, version: keyVersion });

			}

		}).catch((err) => {
			console.log("JE.5");
			kitchinError("JE.1", 500, err, "Internal Server Error", null, null, true);
			return reject("Error fetching symmetric key: " + err);
		});

	});

}

// (PP) - Pepper Password
// (CALL) - crypto.pepperPassword(password, crypto).then((peppered) => { }).catch((err) => { });
// Body:
// - password
// - crypto (encrypt/decrypt)
async function pepperPassword(password, salt, crypto, version, overrideKey) {

	// Return a promise
	return new Promise((resolve, reject) => {

		// Check if crypto is encrypt or decrypt
		if (crypto != "encrypt" && crypto != "decrypt") {

			// Log the error
			kitchinError("PP.1", 400, new Error("Invalid crypto type"), "Invalid request data", null, null, true);

			// Reject the promise
			return reject("Invalid crypto type");

		}

		// Check if overrideKey is provided
		if (overrideKey) {

			// Check if crypto is encrypt or decrypt
			if (crypto == "encrypt") {

				// Encrypt the password
				let cipher = createCipheriv("aes256", overrideKey, salt);
				let encrypted = cipher.update(password, "utf8", "hex");
				encrypted += cipher.final("hex");
				console.log("Encrypted: " + encrypted);
				// Return the encrypted password
				return resolve(encrypted);

			} else {

				// Decrypt the password
				let decipher = createDecipheriv("aes256", overrideKey, salt);
				let decrypted = decipher.update(password, "hex", "utf8");
				decrypted += decipher.final("utf8");

				// Return the decrypted password
				return resolve(decrypted);

			}

		} else {

			// Fetch the symmetric key from Google Secret Manager
			requestSymmetricKey(version).then(({ key, version }) => {

				// Check if crypto is encrypt or decrypt
				if (crypto == "encrypt") {

					// Encrypt the password
					let cipher = createCipheriv("aes256", key, salt);
					let encrypted = cipher.update(password, "utf8", "hex");
					encrypted += cipher.final("hex");

					// Return the encrypted password
					return resolve({ password: encrypted, version: version });

				} else {

					// Decrypt the password
					let decipher = createDecipheriv("aes256", key, salt);
					let decrypted = decipher.update(password, "hex", "utf8");
					decrypted += decipher.final("utf8");

					// Return the decrypted password
					return resolve({ password: decrypted, version: version });

				}

			}).catch((err) => {
				kitchinError("PP.2", 500, err, "Internal Server Error", null, null, true);
				return reject("Error fetching symmetric key: " + err);
			});

		}

	});

}

// (RK) - Rotate Key
// (CALL) - crypto.rotateKey(req, res).then((message) => { }).catch((err) => { });
// Body:
// - type (symmetric/asymmetric)
async function rotateKey(req, res) {

	// ---

	// Keys are rotated for one of three reasons:
	// 1. The key has reached the end of its lifetime (cryptoperiod)
	// 2. The key has encrypted a certain amount of data (usage)
	// 3. The key has been compromised (security breach)
	// Typically 

	// ---

	// 1. Check headers, client request, and more to authenticate and authorize the execution of this function
	// - 1.1. Check if the request is coming from Pub/Sub or https://www.creatingreal.com
	// - 1.2. Check IP address (on GAE) and user-agent of Creating Real
	// - 1.3. Validate JWT token from Creating Real
	// 2. Grab headers and body from request
	// - 2.1. See if this is a symmetric or asymmetric key rotation
	// - 2.2. Check if this is automated or manual (automated = rotation period has passed, manual = admin requested due to security breach)
	// 3. Start maintenance mode

	// ---

}

// PRIVATE FUNCTIONS:
// (UK) - Update Key Function
// (CALL) - crypto.updateKey(path, key).then((version) => { }).catch((err) => { });
// Body:
// - path
// - key
async function updateKey(path, key) {

	// Return a promise
	return new Promise((resolve, reject) => {

		// Creating a new Secret Manager Client
		const client = new SecretManagerServiceClient();

		// Get the latest version of the secret
		client.accessSecretVersion({ name: path }).then(([version]) => {

			// Upload the new key to Google Secret Manager as a new version (increment version number)
			return client.addSecretVersion({ parent: path, payload: { data: key }, version: version.name });

		}).then(([version]) => {

			// TODO: Update base version to the new version on synapse

			// Return the new version
			return resolve(version);

		}).catch((err) => {
			kitchinError("UK.1", 500, err, "Internal Server Error", null, null, true);
			return reject("Error updating key: " + err);
		});

	});

}

// (GK) - Generate Key
// (CALL) - crypto.generateKey(type).then((key) => { }).catch((err) => { });
// Body:
// - type (symmetric/asymmetric)
async function generateKey(type) {

	// Test Data
	const data = "Hello World";

	return new Promise((resolve, reject) => {

		// If type is equal to symmetric, generate a symmetric key
		if (type == "symmetric") {

			// Generate a new key
			const key = randomBytes(16).toString("hex");
			const iv = randomBytes(8).toString("hex");

			// Test Key
			pepperPassword(data, iv, "latest", "encrypt", key).then((encrypted) => {

				console.log("Encrypted: " + encrypted);
				return pepperPassword(encrypted, iv, "latest", "decrypt", key);

			}).then((decrypted) => {

				console.log("Decrypted: " + decrypted);

			});

			// Return the key
			return resolve(key);

		} else if (type == "asymmetric") {

			// RSA Key Generator
			const keygen = require("node-rsa");

			// Generate a new key pair
			const key = new keygen({ b: 2048 });

			// Public Key
			const publicKey = key.exportKey("public");

			// Private Key
			const privateKey = key.exportKey("private");

			// Test Keys
			encryptData(data, publicKey).then((encrypted) => {

				console.log("Encrypted: " + encrypted);

				return decryptData(encrypted, privateKey);

			}).then((decrypted) => {

				console.log("Decrypted: " + decrypted);

			});

			// Return the key pair
			return resolve({ publicKey, privateKey });

		}

	});

}

// Export the modules
module.exports = { encryptData, decryptData, jwtEncryption, pepperPassword, rotateKey };

// --- DO NOT DELETE ---

// MARK: Uncomment and run `node cryption.js` to generate new key pair (SYMMETRIC)
// generateKey("symmetric").then((key) => {

//     console.log("Symmetric Key: \n" + key);

// }).catch((err) => {
//     console.error("Error generating key: " + err);
// });

// // MARK: Uncomment and run `node cryption.js` to generate new key pair (ASYMMETRIC)
// generateKey("asymmetric").then((keys) => {

//     console.log("Public Key: \n" + keys.publicKey);
//     console.log("Private Key: \n" + keys.privateKey);

// }).catch((err) => {
//     console.error("Error generating key pair: " + err);
// });

// --- DO NOT DELETE ---