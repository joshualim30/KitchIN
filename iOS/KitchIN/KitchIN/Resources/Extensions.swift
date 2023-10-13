//
//  Extensions.swift
//  KitchIN
//
//  Created by Joshua Lim on 10/13/23.
//

import Foundation
import UIKit

// Measurements
public let screenSize = UIScreen.main.bounds
public let screenWidth = screenSize.width
public let screenHeight = screenSize.height

// Application Info
public let appVersion = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as! String
public let appBuild = Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as! String
