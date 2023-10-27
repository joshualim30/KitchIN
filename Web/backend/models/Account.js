"use strict";
// Account.js - Account model
// Created on: 10/12/2023

// Import required modules
const mongoose = require("mongoose");

// Define schema
const AccountSchema = new mongoose.Schema({

    // Identification
    account_id: { type: String, required: true }, // Unique ID

    // Account Information
    households: { type: [String], default: [], required: true }, // Households - array of household IDs
    beta: { type: Boolean, default: false, required: true }, // Beta tester
    developer: { type: Boolean, default: false, required: true }, // Developer,
    
    // Personal Information
    profile_picture: { type: String, default: "https://storage.googleapis.com/kitchin-2023.appspot.com/profile_pictures/default.png", required: true }, // Profile picture - link to image in storage
    first_name: { type: String, required: true }, // First name
    last_name: { type: String, required: true }, // Last name
    email: { type: String, required: true }, // Email

    // Important Dates
    created_at: { type: Date, default: Date.now(), required: true }, // Date created
    last_modified: { type: Date, default: Date.now(), required: true }, // Date modified
    last_logout: { type: Date, default: Date.now(), required: true }, // Date last logged out
    last_login: { type: Date, default: Date.now(), required: true }, // Date last logged in
    last_load: { type: Date, default: Date.now(), required: true }, // Date last loaded in info
    last_update:{
        type:{
            fields: { type: [String], default: [], required: true }, // Fields updated
            updated_at: { type: Date, default: Date.now(), required: true }, // Date updated
        },
        _id: false,
        required: true,
        default: {
            fields: [],
            updated_at: Date.now()
        }
    },

    // Authentication
    password:{
        type:{
            hash: { type: String, required: false }, // Hash
            salt: { type: String, required: false }, // Salt
            peppered: { type: Boolean, required: false }, // Peppered
            encrypted_version: { type: Number, required: false }, // Encrypted version
        },
        _id: false,
        required: true
    },

    // Authorization
    authorized_devices: {
        type: [{
            token_id: { type: String, required: false }, // JWT Token ID
            token: { type: String, required: false }, // JWT Token
            encrypted_versions: {
                type: {
                    asymmetric: { type: Number, required: false }, // Asymmetric encrypted version
                    symmetric: { type: Number, required: false }, // Symmetric encrypted version
                },
                _id: false,
                required: true
            },
            device_id: { type: String, required: false }, // Device ID
            device_type: { type: String, required: false }, // Device type
            fcm_token: { type: String, required: false }, // Firebase Cloud Messaging token
            do_not_disturb: { type: Boolean, default: false, required: true }, // if true, then no notifications will be sent to this device
            web: { type: Boolean, default: false, required: true }, // Whether to set cookies or not
        }],
        _id: false,
        required: true
    }

}, { collection: "accounts" }, { _id: false });

// Set unique fields
AccountSchema.index({ account_id: 1, email: 1 }, { unique: true });

// Export model
module.exports = mongoose.model("Account", AccountSchema);