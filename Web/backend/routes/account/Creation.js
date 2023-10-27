"use strict";
// Account.js - Account routes
// Created on: 10/12/2023
// Created By: Mustafa Masody
// -
// -
// Last Edited On: 10/12/2023
// Last Edited By: Mustafa Masody
// -
// -
// Resources:

// Import required modules
const crypto = require("crypto");
const Account = require("../../models/Account");
const { hashPassword, verifyPassword } = require("../../../middleware/Password");
const { upload, createSignedURL } = require("../Media");
const { issueToken } = require("../../../middleware/Session");
const {kitchinError} = require('../../../middleware/Errors');
const {logger} = require('../../../middleware/Logger');
const {dataValidation} = require('../../../middleware/DataValidation');

// IMPORTS:
const Notification = require("../Notifications");

// --- Public Functions ---

// Sign Up Function
// HEADERS:
// - x-from: Email
// - x-authentication: Password
// BODY:
// - first_name
// - last_name
async function signUp(req, res){

        // Get headers from request
        const headers = req.headers;

        if(headers == null || headers['x-from'] == null || headers['x-authentication'] == null)
            return kitchinError("SU.1", 400, new Error("Invalid data provided"), "Invalid data provided", req, res, true);

        const email = headers["x-from"].toLowerCase();
        const password = headers["x-authentication"];
    
        // Get parameters from request
        const params = req.body;

        if(params == null || params.first_name == null || params.last_name == null)
            return kitchinError("SU.2", 400, new Error("Invalid data provided"), "Invalid data provided", req, res, true);

        // Declare global variables
        let accountID = null;
        let hashed = null;
        let jwt = null;

        // Validate parameters
        dataValidation({email:email}).then((valid) => {

            // If the parameters are not valid
            if(!valid)
                throw { index: "SU.1", status:400, error: new Error("Invalid data provided"), message: "Invalid data provided"};

            return Account.findOne({email: email});

        }).then((account) => {

            if(account) throw { index:"SU.2", status:400, error: new Error("Account already exists"), message: "Account already exists"};

            return generateAccountID();

        }).then((accountNumber) => {
                
            accountID = accountNumber;

            return hashPassword(password);
    
        })
        .then((password) => {

            hashed = password;

            return issueToken(req, res);
        }).then(({id, token, asymmetric, symmetric}) => {

            jwt = token;

            if(req.body.web && req.body.web === true){
                res.cookie('x-bearer', token, { maxAge: 900000, httpOnly: true });
                res.cookie('x-device-id', headers["x-device-id"], { maxAge: 900000, httpOnly: true });
                res.cookie('x-user', email, { maxAge: 900000, httpOnly: true });
            }

            let newAccount = new Account({
                account_id: accountID,
                households: [],
                notification_token: null,
                beta: false,
                developer: false,
                profile_picture: "https://storage.googleapis.com/kitchin-2023.appspot.com/profile_pictures/default.png",
                first_name: params.first_name,
                last_name: params.last_name,
                email: email,
                created_at: Date.now(),
                last_modified: Date.now(),
                last_logout: Date.now(),
                last_login: Date.now(),
                last_loaded: Date.now(),
                password: {
                    hash: hashed.hash,
                    salt: hashed.salt,
                    peppered: true,
                    encrypted_version: hashed.version
                },
                authorized_devices: 
                    [{
                        device_id: headers["x-device-id"],
                        device_type: headers["x-user-agent"],
                        token_id: id,
                        token: jwt,
                        encrypted_versions: {
                            asymmetric: asymmetric,
                            symmetric: symmetric
                        },
                        fcm_token: req.body.notification_token ? req.body.notification_token : null,
                        do_not_disturb: req.body.do_not_disturb ? req.body.do_not_disturb : false,
                        web: req.body.web ? req.body.web : false
                    }]
                
                });

            return newAccount.save().catch((err) => {
                throw { index: "SU.3", status:500, error: err, message: "Internal Server Error"};
            });

        }).then((newAccount1) => {

            return res.status(200).json({
                success: true,
                message: "Successfully created account!",
                account_id: accountID,
                token: jwt
            });

        }).catch((err) => {
            return kitchinError(err.index, err.status, err.error, err.message, req, res, true);
    });
}

// (GAID) - Generate Account ID
// (CALL) - generateAccountID().then((accountNumber) => { }).catch((err) => { });
async function generateAccountID() {

	// Return a new Promise
	return new Promise((resolve, reject) => {

		// Generate a random account number
		const accountNumber = crypto.randomBytes(16).toString("hex");

		// Check if account number exists
		Account.findOne({ account_id: accountNumber }).then((account) => {

			// If the account number exists, generate a new one, else return the account number
			if (account) {
				return generateAccountID();
			} else {
				return resolve(accountNumber);
			}

		}).catch((err) => {
			return reject(synapseError("GAID.1", 500, err, "Internal Server Error", req, res, true));
		});

	});

}

module.exports = {
    signUp
};