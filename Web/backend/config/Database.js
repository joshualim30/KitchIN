"use strict";
// Version: v2.00.0
// Database.js - MongoDB Database Connection
// Created by: Joshua Lim
// Created on: 11/08/2022
// Last edited by: Joshua Lim
// Last edited on: 09/02/2023
// --
// RESOURCES:
// - https://mongoosejs.com/docs/connections.html
// --
// TODO:
// -
// --
// WIKI DOCUMENTATION:
// -
// --

// IMPORTS:
const mongoose = require("mongoose"), Admin = mongoose.mongo.Admin;
const { kitchinError } = require("../../middleware/Errors");

// (CB) - Create MongoDB Database Connection
// (CALL) - database.connectDB(uri, database).then(() => { }).catch((err) => { });
// Body:
// - uri
// - database
async function connectDB(uri, database) {

	try {

		mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.NODE_ENV == "production" ? "kitchin-prod" : "kitchin-dev" }); // dbName will override current connection in MongoDB URI


		mongoose.connection.on("error", (err) => {
			kitchinError("CDB.1", 500, err, "Failed to connect to MongoDB", null, null, true);
		});

		// Log the connection state
		mongoose.connection.on("connected", () => {

			// Log the database
			if (database) {
				console.log("DATABASE DETECTED");
				console.log("Successfully Connected to MongoDB '" + database + "' Database.");
			}
			else {
				console.log("NO DATABASE ");
				console.log("Successfully Connected to MongoDB. No Database Specified.");
			}

			// Log the connection name
			console.log("Connection Name: " + mongoose.connection.name);

			// Log the connection state
			console.log("Connection State: " + mongoose.connection.readyState);

			return true;

		});

	} catch (error) {
		kitchinError("CDB.1", 500, error, "Failed to connect to MongoDB", null, null, true);
	}

}

// (SDB) - Switch Database
// (CALL) - database.switchDB(uri, database).then(() => { }).catch((err) => { });
// Body:
// - uri
// - database
async function switchDB(uri, database) {

	try {

		// Close the current connection
		console.log("Closing current connection...");
		mongoose.connection.close();

		// Connect to the new database
		console.log("Connecting to new database...");
		mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: database }); // dbName will override current connection in MongoDB URI

		// Log the connection state
		mongoose.connection.on("connected", () => {

			// Log the database
			console.log("Successfully Connected to MongoDB '" + database + "' Database.");

			// Log the connection name
			console.log("Connection Name: " + mongoose.connection.name);

			// Log the connection state
			console.log("Connection State: " + mongoose.connection.readyState);

		});

	} catch (error) {
		kitchinError("SDB.1", 500, error, "Failed to connect to MongoDB", null, null, true);
	}

}

// EXPORTS:
module.exports = { connectDB, switchDB };