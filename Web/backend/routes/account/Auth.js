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

// Sign In Function
// HEADERS:
// - x-from: Email
// - x-authentication: Password
async function signIn(req, res, next){

    // Get headers
    let email = req.headers['x-from'].toLowerCase();
    let password = req.headers['x-authentication'];
    let device_id = req.headers['x-device-id'];

    const headers = req.headers;

    // Declare global variables
    let account = null;
    let auth = null;

    dataValidation({email: email, password: password}).then((result) => {

        if(!result) throw { index: "SI.1", status:400, error: new Error("Invalid data provided"), message: "Invalid data provided"};

        // Check if the account exists
        return Account.findOne({email: email});

    }).then((foundAccount) => {

        if(!foundAccount) throw { index: "SI.2", status:400, error: new Error("Account does not exist"), message: "Account does not exist"};

        account = foundAccount;

        return verifyPassword(password, foundAccount.password.salt, foundAccount.password.hash, foundAccount.password.encrypted_version);
        
    }).then((result) => {

        if(!result) throw { index: "SI.3", status:400, error: new Error("Incorrect password"), message: "Incorrect password"};

        return issueToken(req, res);

    }).then(({id, token, asymmetric, symmetric}) => {

        // Set x-bearer header
        req.headers['x-bearer'] = token;
        auth = {id: id, token: token, asymmetric: asymmetric, symmetric: symmetric};

        let found = false;

        // check if authorized_devices contains a device with the same device_id inside the JSON object
        for(let i = 0; i < account.authorized_devices.length; i++){
        
            if(account.authorized_devices[i].device_id == device_id) {

                let updated = account.authorized_devices[i];
                updated.token_id = id;
                updated.token = token;
                updated.encrypted_versions.asymmetric = asymmetric;
                updated.encrypted_versions.symmetric = symmetric;
                updated.fcm_token = req.body.notification_token ? req.body.notification_token : null;
                updated.do_not_disturb = req.body.do_not_disturb ? req.body.do_not_disturb : false;


                account.authorized_devices[i] = updated;

                found = true;

                if(account.authorized_devices[i].web){
                    res.cookie("x-bearer", token, {httpOnly: true, secure: true, sameSite: "none"});
                    res.cookie("x-device-id", device_id, {httpOnly: true, secure: true, sameSite: "none"});
                    res.cookie("x-user", email, {httpOnly: true, secure: true, sameSite: "none"});
                }

                return account.save();

            }
        }

        if(!found){

            let webBool = false;

            if((headers['x-user-agent'] !== null && headers['x-user-agent'] !== undefined) && headers['x-user-agent'].includes("Mozilla") || headers['x-user-agent'].includes("Postman") || headers['x-user-agent'].includes("Chrome") || headers['x-user-agent'].includes("Safari") || headers['x-user-agent'].includes("Edge")){                webBool = true;
            }
            
                account.authorized_devices.push({
                    device_id: device_id,
                    device_type: req.headers['x-user-agent'],
                    token_id: id,
                    token: token,
                    encrypted_versions: {
                        asymmetric: asymmetric,
                        symmetric: symmetric
                    },
                    fcm_token: req.body.notification_token ? req.body.notification_token : null,
                    do_not_disturb: req.body.do_not_disturb ? req.body.do_not_disturb : false,
                    web: webBool
                });

                if(webBool){
                    res.cookie("x-bearer", token, {httpOnly: true, secure: true, sameSite: "none"});
                    res.cookie("x-device-id", device_id, {httpOnly: true, secure: true, sameSite: "none"});
                    res.cookie("x-user", email, {httpOnly: true, secure: true, sameSite: "none"});
                }
    
                return account.save().catch((err) => {
                    return kitchinError("SI.4", 500, err, "Error saving account", req, res, true);
                });
    
            }

    }).then(() => {

        return Account.findOneAndUpdate({email: email}, {last_login: Date.now(),
            last_update: {
                fields: ["session||" + auth.token],
                updated_at: Date.now()
            },
            notifications: {
                fcm_token: req.body.notification_token ? req.body.notification_token : null
            }
        });
    })
    .then(() => {
                return next();
    }).catch((err) => {
        return kitchinError(err.index, err.status, err.error, err.message, req, res, true);
    });

}

// (LI) - Load In
// (POST) - /api/v2/release/account/loadin OR after sign in
// Headers:
// - c-device-id
// - c-from
async function loadIn(req, res){

    // Get headers
    const device_id = req.headers['x-device-id'];
    const email = req.headers['x-from'].toLowerCase();

    // Declare global variables
    let foundAccount = null;
    let foundAuth = null;

    dataValidation({email: email}).then((result) => {

        if(!result) throw { index: "LI.1", status:400, error: new Error("Invalid data provided"), message: "Invalid data provided"};

        // Check if the account exists
        return Account.findOne({email: email});

    }).then((account) => {

        if(!account) throw { index: "LI.2", status:400, error: new Error("Account does not exist"), message: "Account does not exist"};

        for(let i = 0; i < account.authorized_devices.length; i++){

            if(account.authorized_devices[i].device_id == device_id) foundAuth = account.authorized_devices[i];

        }

        if(foundAuth == null) throw { index: "LI.3", status:400, error: new Error("Device ID does not match"), message: "Device ID does not match"};

        foundAccount = account;


        let updated = {};   

        if(account.last_login > account.last_load){

            updated = {
                ...updated,
               profile_picture: account.profile_picture,
                first_name: account.first_name,
                last_name: account.last_name,
                email: account.email,
            };

        }

        if(account.last_update.updated_at > account.last_load){

            for(let i = 0; i < account.last_update.fields.length; i++){

                
				// Set field and value variables
				let field = null;
				let value = null;

				// Check if they updated session object
				if (account.last_update.fields[i].includes("session")) {
					field = "token";
                    value = account.last_update.fields[i].split("||")[1];
				} else {
					field = account.last_update.fields[i];
					value = account[field];
				}

				// Store value in updated object
				updated = { ...updated, [field]: value };

            }

            Account.findOneAndUpdate({ email: email }, { last_load: Date.now() }).then(() => {

                return res.status(200).json({
                    success: true,
                    message: "Account loaded in successfully",
                    new_values: updated
                });

            }).catch((err) => {
                throw { index: "LI.4", status:500, error: err, message: "Error updating last load time"};
            });

        } else {

            Account.findOneAndUpdate({email: email}, {last_load: Date.now()}).then(() => {

                return res.status(200).json({
                    success: true,
                    message: "Account loaded in successfully",
                    new_values: updated
                });

            }).catch((err) => {
                throw { index: "LI.5", status:500, error: err, message: "Error updating last load time"};
            });

        }

    }).catch((err) => {
        return kitchinError(err.index, err.status, err.error, err.message, req, res, true);
    });

}

// (SO) - Sign Out
// (POST) - /api/v2/release/account/signout
// Headers:
// - x-device-id
// - x-from
async function signOut(req, res){

    const device_id = req.body.web ? req.cookies['x-device-id'] : req.headers['x-device-id'];
    let email = req.body.web ? req.cookies['x-user'].toLowerCase() : req.headers['x-from'].toLowerCase();

    dataValidation({email: email}).then((result) => {

        if(!result) throw { index: "SO.1", status:400, error: new Error("Invalid data provided"), message: "Invalid data provided"};

        return Account.findOne({email: email});

    }).then((account) => {

        if(!account) throw { index: "SO.2", status:400, error: new Error("Account does not exist"), message: "Account does not exist"};

        let found = false;
        for(let i = 0; i < account.authorized_devices.length; i++){

            if(account.authorized_devices[i].device_id == device_id){

                account.authorized_devices.splice(i, 1);

                found = true;

                return account.save();

            }

        }

        if(!found) throw { index: "SO.3", status:400, error: new Error("Device ID does not match"), message: "Device ID does not match"};

        return account.save();

    }).then(() => {

        if(req.body.web){
            res.clearCookie('x-bearer');
            res.clearCookie('x-device-id');
            res.clearCookie('x-user');
        }

        return res.status(200).json({
            success: true,
            message: "Account signed out successfully"
        });
    }).catch((err) => {
        return kitchinError(err.index, err.status, err.error, err.message, req, res, true);
    });

}

module.exports = {
    signIn,
    signOut,
    loadIn
}