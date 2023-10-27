"use strict";
// Notifications.js - Notification routes
// Created on: 10/7/2023

// IMPORTS:
const admin = require("firebase-admin");
const secret = require("../config/Secret");
const { JWT } = require("google-auth-library");

// (SN) - Send Notification
// Params:
// - token
// - title
// - body
// - isBackground
// - json
async function sendNotification(token, title, body, isBackground, json) {

    return new Promise((resolve, reject) => {

        // Get Firebase Key from Google Secret Manager
        secret.requestFirebasePrivateKey().then((key) => {

            // Check if key exists
            if (!key) {
                reject("SN.1");
            }

            // Get OAuth2.0 Access Token from Google
            return getAccessToken(key);

        }).then((access_token) => {

            // Check if access_token exists
            if (!access_token) {
                reject("SN.2");
            }

            // Send notification
            return fetch("https://fcm.googleapis.com/v1/projects/kitchin-2023/messages:send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + access_token
                },
                body: JSON.stringify({
                    "message": {
                        "token": token,
                        "notification": {
                            "title": title,
                            "body": body
                        },
                        "data": json,
                        "android": {
                            "notification": {
                                "click_action": "TOP_STORY_ACTIVITY", // TODO: Change this
                                "body": body,
                            }
                        },
                        "apns": {
                            "payload": {
                                "aps": {
                                    "content-available": isBackground ? 1 : 0
                                }
                            }
                        }
                    }
                })
            });

        }).then((response) => {

            // Check if response exists
            if (!response) {
                reject("SN.3");
            }

            // Return response
            return response.json();

        }).then((data) => {

            // Check if data exists
            if (!data) {
                reject("SN.4");
            }

            // Return data
            return data;

        }).catch((err) => {
            reject(err);
        });

    });

}

// (CALL) - getAccessToken(key).then((access_token) => { }).catch((err) => { });
// Params:
// - key
async function getAccessToken(key) {

    return new Promise(function (resolve, reject) {

        // Create a JWT client
        const jwtClient = new JWT({
            email: key.client_email,
            key: key.private_key,
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        });

        // Authenticate request
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });

    });

}

// EXPORTS:
module.exports = { sendNotification };