"use strict";
// DataValidation.js - Data validation routes
// Created on: 10/14/2023
// Created By: Mustafa Masody
// -
// -
// Last Edited On: 10/14/2023
// Last Edited By: Mustafa Masody
// -
// -
// Resources:


// PRIVATE FUNCTIONS:
// (DV) - Data Validation
// (CALL) - dataValidation(params, expectedData).then((result) => { }).catch((err) => { });
// Params:
// - params
// - expectedData
async function dataValidation(params) {

	return new Promise((resolve, reject) => {

		// Check if params is null
		if (params == null) {
			resolve(false);
		}

		// Validate first and last name (if provided)
		if (params.first_name || params.last_name) {

			// Regex for first and last name (only allows letters, spaces, and hyphens, minimum of 2 characters, maximum of 50 characters)
			const regex = /^[a-zA-Z- ]{2,50}$/;

			// Validate first name
			if (params.first_name) {
				if (!regex.test(params.first_name)) {
					resolve(false);
				}
			}

			// Validate last name
			if (params.last_name) {
				if (!regex.test(params.last_name)) {
					resolve(false);
				}
			}

		}

		// Validate email (if provided)
		if (params.email) {

			// Regex for email (only allows letters, numbers, periods, underscores, hyphens, and @ symbol)
			const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

			// Validate email
			if (!regex.test(params.email)) {
				resolve(false);
			}

		}

		// Validate phone number (if provided)
		if (params.phone_number) {

			// Regex for phone number (only allows numbers, spaces, and hyphens)
			const regex = /^[0-9- ]+$/;

			// Validate phone number
			if (!regex.test(params.phone_number)) {
				resolve(false);
			}

		}

		// Validate preferences (if provided)
		if (params.preferences) {

			// Loop through preferences
			for (let i = 0; i < params.preferences.length; i++) {

				// Loop through preference fields
				for (let j = 0; j < Account.preferences.length; j++) {

					// If the preference field is found, validate the preference
					if (params.preferences[i][Account.preferences[j]]) {

						// Regex for preference (only allows numbers, spaces, and hyphens)
						const regex = /^[0-9- ]+$/;

						// Validate preference
						if (!regex.test(params.preferences[i][Account.preferences[j]])) {
							resolve(false);
						}

					}

				}

			}

		}

		// TODO: birth_date, device_id (maybe), etc.

		// Passed all validation
		resolve(true);

	});

}

module.exports = { dataValidation};