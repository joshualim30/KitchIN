"use strict";
// Version: v2.00.0
// Logger.js - Logging for Creating Real
// Created by: Joshua Lim
// Created on: 08/29/2023
// Last edited by: Joshua Lim
// Last edited on: 08/29/2023
// --
// RESOURCES:
// - Logging: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
// - Vocabulary: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html
// --
// TODO:
// - Implement into all routes and projects
// - If log is anything other than INFO, then send to synapse for analysis and database storage
// --
// WIKI DOCUMENTATION:
// -
// --

// IMPORTS:
const ip = require("ip");
const os = require("os");
const WebServiceClient = require("@maxmind/geoip2-node").WebServiceClient;
const client = new WebServiceClient("909709", "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"); // To query the GeoLite2 web service, you must set the optional `host` parameter

// PUBLIC FUNCTIONS:
// (L) Logger - Logs in production
// (CALL) - logger({ level: "INFO", description: "This is a test log" }, req, res);
// Params:
// - params: object containing log information
// - req: request object
// - res: response object
async function logger(params, req, res) {

	// Params:
	// - level
	// - description
	// - error (optional)

	// Get remote ip address
	const remote = req ? req.headers[ "x-forwarded-for" ] ? req.headers[ "x-forwarded-for" ] : req.connection.remoteAddress ? req.connection.remoteAddress : null : null;

	// Check if IP address has multiple addresses, if so, then get the first one
	const ip_address = remote ? remote.includes(",") ? remote.split(",")[0] : remote : null;

	// Create geo object from local ip address
	let geo = null;
	try {
		geo = remote && remote != "::1" && params.level != "INFO" ? await client.insights(ip_address) : null;
	} catch (error) {
		console.log(error);
	}

	// Declare log variable
	let log = {
		timestamp: new Date().toISOString(),
		appid: "crcl-app",
		level: params.level, // INFO, WARN, ERR, CRIT
		description: params.description,
		useragent: req ? req.headers[ "c-user-agent" ] ? req.headers[ "c-user-agent" ] : req.headers[ "user-agent" ] ? req.headers[ "user-agent" ] : null : null,
		source_ip: remote,
		host_ip: ip.address(),
		hostname: os.hostname(),
		protocol: req ? req.protocol ? req.protocol : null : null,
		port: req ? req.socket.localPort ? req.socket.localPort : null : null,
		call: req ? req.originalUrl ? req.originalUrl : null : null,
		method: req ? req.method ? req.method : null : null,
		region: geo ? geo.region ? geo.region : null + ", " + geo.country ? geo.country : null : null,
		geo: geo ? geo : null,
		headers: req ? req.headers ? req.headers : null : null,
		session: req ? req.session ? req.session : null : null,
		cookies: req ? req.cookies ? JSON.stringify(req.cookies) : null : null,
		request: req ? req.body ? JSON.stringify(req.body) : null : null,
		response: res ? JSON.stringify(res.body) : null,
		error: params.error ? params.error : null,
	};

	// Loop through log object and remove null values
	for (let key in log) {

		// Check if value is null
		if (log[key] == null) {
            
			// Delete key
			delete log[key];

		}

	}

	// Send log to synapse
	if (params.level != "INFO") {
		// TODO: Send log to synapse for analysis and database storage (if log is anything other than INFO)
	}

	// Log the log
	if (res)
		console.log(log);

	// Return res
	return res ? res : console.log(log);

}

// EXPORTS:
module.exports = { logger };