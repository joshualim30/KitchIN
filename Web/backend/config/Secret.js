"use strict";
// Version: v2.00.0
// Secret.js - GCP Secret Manager Configuration
// Created by: Mustafa Masody
// Created on: 01/15/2023
// Last edited by: Joshua Lim
// Last edited on: 09/02/2023
// --
// RESOURCES:
// - https://cloud.google.com/secret-manager/docs/creating-and-accessing-secrets#secretmanager-create-secret-nodejs
// - https://cloud.google.com/secret-manager/docs/creating-and-accessing-secrets#secretmanager-access-secret-version-nodejs
// --
// TODO:
// -
// --
// WIKI DOCUMENTATION:
// -
// --

// IMPORTS:
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

// PUBLIC FUNCTIONS:
// (RMS) - Requesting the MongoDB URI from Google Secret Manager
// (CALL) - secret.requestMongoSecret().then((uri) => { }).catch((err) => { });
async function requestMongoSecret() {

	// Secret Path
	const name = process.env.NODE_ENV == "production" ? "projects/kitchin-2023/secrets/mongodb_uri/versions/latest" : "projects/kitchin-2023/secrets/mongodb_uri/versions/latest";

	// Returning a Promise
	return new Promise((resolve, reject) => {

		// Creating a new Secret Manager Client
		const client = new SecretManagerServiceClient();

		// Accessing the Secret Version
		client.accessSecretVersion({ name: name }).then(([ version ]) => {

			// Fetching the payload
			const payload = version.payload.data.toString();

			// Resolving the Promise
			resolve(payload);

		}).catch((err) => {
			console.error("RMS.1 - Failed to fetch MongoDB URI from Google Secret Manager due to the following error: " + err);
			reject("RMS.1 - Internal server error");
		});

	});

}

// (REA) - Requesting the Email Authentication from Google Secret Manager
// (CALL) - secret.requestEmailAuth().then((email) => { }).catch((err) => { });
async function requestEmailAuth () {

	// Secret Path
	const name = "projects/kitchin-2023/secrets/auth_support_email/versions/latest";

	// Returning a Promise
	return new Promise((resolve, reject) => {

		// Creating a new Secret Manager Client
		const client = new SecretManagerServiceClient();

		// Accessing the Secret Version
		client.accessSecretVersion({ name: name }).then(([ version ]) => {

			// Fetching the payload
			const payload = version.payload.data.toString();

			// Resolving the Promise
			resolve(payload);

		}).catch((err) => {
			console.error("REA.1 - Failed to fetch Email Authentication from Google Secret Manager due to the following error: " + err);
			reject("REA.1 - Internal server error");
		});

	});

}

// (RFPK) - Requesting the Firebase Private Key from Google Secret Manager
// (CALL) - secret.requestFirebasePrivateKey().then((key) => { }).catch((err) => { });
async function requestFirebasePrivateKey () {

	// Secret Path
	const name = "projects/kitchin-2023/secrets/auth_firebase/versions/latest";

	// Returning a Promise
	return new Promise((resolve, reject) => {

		// Creating a new Secret Manager Client
		const client = new SecretManagerServiceClient();

		// Accessing the Secret Version
		client.accessSecretVersion({ name: name }).then(([ version ]) => {

			// Fetching the payload (convert to JSON file)
			const payload = JSON.parse(version.payload.data.toString());

			// Resolving the Promise
			resolve(payload);

		}).catch((err) => {
			console.error("RFPK.1 - Failed to fetch Firebase Private Key from Google Secret Manager due to the following error: " + err);
			reject("RFPK.1 - Internal server error");
		});

	});

}

// (RPK.S) - Requesting the Private Key from Google Secret Manager
// (CALL) - secret.requestPrivateKey(version).then((key) => { }).catch((err) => { });
// Body:
// - version (optional)
async function requestPrivateKey (version) {

	// Check if version is null or undefined
	if (version == null || version == undefined)
		version = "latest";

	// Secret Path
	const name = "projects/kitchin-2023/secrets/private_key/versions/" + version.toString();

	// Returning a Promise
	return new Promise((resolve, reject) => {

		// Creating a new Secret Manager Client
		const client = new SecretManagerServiceClient();

		// Accessing the Secret Version
		client.accessSecretVersion({ name: name }).then(([version]) => {

			// Fetching the payload
			const payload = version.payload.data.toString();

			// Get version number
			const versionName = version.name.split("/").pop();

			// Resolving the Promise
			resolve({ key: payload, version: versionName });

		}).catch((err) => {
			console.error("RPK.S.2 - Failed to fetch Private Key from Google Secret Manager due to the following error: " + err);
			reject("RPK.S.2 - Internal server error");
		});

	});

}

// (RMHS) - Requesting the media handler secret from Google Secret Manager
// (CALL) - secret.requestMediaHandlerSecret().then((uri) => { }).catch((err) => { });
async function requestMediaHandlerSecret() {

	// Secret Path
	const name = process.env.NODE_ENV == "production" ? "projects/kitchin-2023/secrets/gae_credentials/versions/latest" : "projects/kitchin-2023/secrets/gae_credentials/versions/latest";

	// Returning a Promise
	return new Promise((resolve, reject) => {

		// Creating a new Secret Manager Client
		const client = new SecretManagerServiceClient();

		// Accessing the Secret Version
		client.accessSecretVersion({ name: name }).then(([ version ]) => {

			// Fetching the payload
			const payload = version.payload.data.toString();

			// Resolving the Promise
			resolve(payload);

		}).catch((err) => {
			console.error("RMS.1 - Failed to fetch MongoDB URI from Google Secret Manager due to the following error: " + err);
			reject("RMS.1 - Internal server error");
		});

	});

}

// (RPK.P) - Requesting the Public Key from Google Secret Manager
// (CALL) - secret.requestPublicKey(version).then((key) => { }).catch((err) => { });
// Body:
// - version (optional)
async function requestPublicKey (version) {

	// Check if version is null or undefined
	if (version == null || version == undefined)
		version = "latest";

	// Secret Path
	const name = "projects/kitchin-2023/secrets/public_key/versions/" + version.toString();

	// Returning a Promise
	return new Promise((resolve, reject) => {

		// Creating a new Secret Manager Client
		const client = new SecretManagerServiceClient();

		// Accessing the Secret Version
		client.accessSecretVersion({ name: name }).then(([ version ]) => {

			// Fetching the payload
			const payload = version.payload.data.toString();
            
			// Get version number
			const versionName = version.name.split("/").pop();

			// Resolving the Promise (key and version)
			resolve({ key: payload, version: versionName });

		}).catch((err) => {
			console.error("RPK.P.1 - Failed to fetch Public Key from Google Secret Manager due to the following error: " + err);
			reject("RPK.P.1 - Internal server error");
		});

	});

}

// (RSK) - Requesting the Symmetric Key from Google Secret Manager
// (CALL) - secret.requestSymmetricKey(version).then((key) => { }).catch((err) => { });
// Body:
// - version (optional)
async function requestSymmetricKey (version) {

	// Check if version is null or undefined
	if (version == null || version == undefined)
		version = "latest";

	// Secret Path
	const name = "projects/kitchin-2023/secrets/symmetric_key/versions/" + version;

	// Returning a Promise
	return new Promise((resolve, reject) => {

		// Creating a new Secret Manager Client
		const client = new SecretManagerServiceClient();

		// Accessing the Secret Version
		client.accessSecretVersion({ name: name }).then(([ version ]) => {

			// Fetching the payload
			const payload = version.payload.data.toString();

			// Get version number
			const versionName = version.name.split("/").pop();

			// Resolving the Promise
			resolve({ key: payload, version: versionName });

		}).catch((err) => {
			console.error("RSK.1 - Failed to fetch Symmetric Key from Google Secret Manager due to the following error: " + err);
			reject("RSK.1 - Internal server error");
		});

	});

}

// EXPORTS:
module.exports = { 
	requestMongoSecret: requestMongoSecret, 
	requestEmailAuth: requestEmailAuth, 
	requestFirebasePrivateKey: requestFirebasePrivateKey, 
	requestPrivateKey: requestPrivateKey, 
	requestPublicKey: requestPublicKey, 
	requestSymmetricKey: requestSymmetricKey,
	requestMediaHandlerSecret: requestMediaHandlerSecret
};