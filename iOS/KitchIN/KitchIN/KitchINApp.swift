//
//  KitchINApp.swift
//  KitchIN
//
//  Created by Joshua Lim on 10/9/23.
//

import SwiftUI
import SwiftData
import FirebaseCore
import FirebaseMessaging

// Global Variables
public let statusCodes = [200, 201, 202, 203, 204, 300, 301, 302, 303, 304, 400, 401, 402, 403, 404, 500, 501, 502, 503]

// App Delegate
class AppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {
    
    // On Launch
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        
        // Configure Firebase
        FirebaseApp.configure()
        
        // Set Notification Delegate
        UNUserNotificationCenter.current().delegate = self

        // Set Notification Options
        let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
        UNUserNotificationCenter.current().requestAuthorization(
          options: authOptions,
          completionHandler: { _, _ in }
        )

        // Register for Remote Notifications
        application.registerForRemoteNotifications()
        
        // Set FCM Messaging Delegate
        Messaging.messaging().delegate = self
        
        // FCM Messaging Token
        Messaging.messaging().token { token, error in
            
            if let error = error {
                
                print("Error fetching FCM registration token: \(error)")
                
            } else if let token = token {
                
                print("FCM registration token: \(token)")
                
            }
            
        }
        
        // Return
        return true
        
    }
    
    // Monitor FCM Token Refresh
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
      
        print("Firebase registration token: \(String(describing: fcmToken))")
        UserDefaults.standard.set(fcmToken, forKey: "fcm_token") // Store FCM Token

        let dataDict: [String: String] = ["token": fcmToken ?? ""]
     
        NotificationCenter.default.post(name: Notification.Name("FCMToken"), object: nil, userInfo: dataDict)
        
          // TODO: If necessary send token to application server.
          // Note: This callback is fired at each app startup and whenever a new token is generated.
        
    }
    
    // Application Registers for Remote Notification
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
      
        // Set APNS Token
        Messaging.messaging().apnsToken = deviceToken
        
        Messaging.messaging().token { token, error in
            
            if let error = error {
                
                print("Error fetching FCM registration token: \(error)")
                
            } else if let token = token {
                
                print("FCM TOKEN: \(Messaging.messaging().fcmToken)")
                print("FCM registration token: \(token)")
                
            }
            
        }
        
    }

}


// Application Window Setup
@main
struct KitchINApp: App {
    
    // Use App Delegate
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate

    // Set up scene
    var body: some Scene {
        
        WindowGroup {
            
            ContentView()
                .modelContainer(for: [Item.self])
            
        }
        
    }
    
}
