"use strict";
// Version: v2.00.0
// Errors.js - Custom Error Handler for the backend
// Created by: Siamak Erami
// Created on: 08/19/2023
// Last edited by: Joshua Lim
// Last edited on: 08/29/2023
// --
// RESOURCES:
// - https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
// --
// TODO:
// - Implement into all routes and projects
// --
// WIKI DOCUMENTATION:
// -
// --

// IMPORTS:
const crypto = require("crypto");
const errors = require("../backend/src/json/statusCodes.json");
const { logger } = require("./Logger");
const errorObjects = errors.errors;

// PUBLIC FUNCTIONS:
// Synapse Error Function
// (CALL) - synapseError(0, 400, new Error("This is a test error"), "This is a test error message", req, res, false);
// Params:
// - index: index of the error
// - statusCode: status code of the error
// - newError: new Error("This is a test error")
// - message: "This is a test error message"
// - req: request object
// - res: response object
// - is_sensitive: true = send error message to synapse, false = don't send error message to synapse (default = false)
async function kitchinError(index, statusCode, newError, message, req, res, is_sensitive) {

	// Check if status code is in ./statusCodes.json
	for (let i = 0; i < errorObjects.length; i++) {

		// If status code is in ./statusCodes.json, then send error message to client
		if (errorObjects[i].statusCode == statusCode) {

			// Set error message to be logged in console
			const consoleReturnData = {
				id: crypto.randomBytes(16).toString("hex"),
				index: index,
				statusCode: statusCode,
				title: errorObjects[ i ].errorTitle,
				message: message,
				trace: newError ? newError.stack ? newError.stack : "No stack trace available" : "No stack trace available"
			};

			// Log error message to console
			try {

				process.env.NODE_ENV === "development" ? console.log(consoleReturnData) : await logger({ level: is_sensitive ? "CRIT" : "ERR", description: message, error: consoleReturnData }, req, res);
				return res.status(statusCode).json({ success: false, message: message });
                
			} catch (error) {
				console.log("Issue Logging Error: " + error);
			}

			//     // Set url to send error message to
			//     const url = process.env.URL + "/api/error/new";

			//     // Check if error is sensitive, if so, then send error message to synapse (TODO: Increment for threshold)
			//     if (is_sensitive) {

			//         fetch(url, {
			//             method: 'POST',
			//             headers: {
			//                 'Content-Type': 'application/json',
			//             },
			//             body: JSON.stringify(consoleReturnData),
			//         }).then(response => {

			//             // If error message was sent successfully to synapse,then log locally and send error message to client
			//             if (response.status === 200) {

			//                 console.log("===============================================================");
			//                 console.log("Error ID: " + errorID);
			//                 for (let param in consoleReturnData) {

			//                     // Check if JSON
			//                     const logValue = consoleReturnData[param] === "object" ? JSON.stringify(consoleReturnData[param]) : consoleReturnData[param];
			//                     console.log(param + " : " + logValue);

			//                 }
			//                 console.log("===============================================================");

			//                 devLog("Error: " + errorTrace);
			//                 devLog("Index: " + index);

			//                 return res.status(statusCode).json({ success: false, message: message });

			//             }

			//         });

			//     } else {

			//         console.log("===============================================================");
			//         console.log("Error ID: " + errorID);
			//         for (let param in consoleReturnData) {

			//             // Check if JSON
			//             const logValue = consoleReturnData[param] === "object" ? JSON.stringify(consoleReturnData[param]) : consoleReturnData[param];
			//             console.log(param + " : " + logValue);

			//         }
			//         console.log("===============================================================");

			//         devLog("Error: " + errorTrace);
			//         devLog("Index: " + index);

			//         return res.status(statusCode).json({ success: false, message: message });

			//     }

		}

	}

}

// Export the module
module.exports = { kitchinError };