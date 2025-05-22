//
//  AppDelegate.swift
//  fbtoken
//
//  Created by Bill Palmestedt on 2025-05-21.
//

import UIKit
import Firebase
import FirebaseMessaging
import FirebaseAuth
import UserNotifications

class AppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure()

        UNUserNotificationCenter.current().delegate = self
        Messaging.messaging().delegate = self

        // Logga in anonymt
        Auth.auth().signInAnonymously { result, error in
            if let error = error {
                print("Fel vid anonym inloggning:", error)
            } else {
                print("Inloggad som:", result?.user.uid ?? "okänd")
                self.requestNotificationPermission()
            }
        }

        return true
    }

    func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, _ in
            if granted {
                DispatchQueue.main.async {
                    UIApplication.shared.registerForRemoteNotifications()
                }
            }
        }
    }

    func application(_ application: UIApplication,
                     didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
    }

    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        guard let fcmToken = fcmToken else { return }

        print("FCM Token:", fcmToken)

        guard let userId = Auth.auth().currentUser?.uid else {
            print("Ingen inloggad användare")
            return
        }

        let db = Firestore.firestore()
        db.collection("users").document(userId).setData([
            "fcmToken": fcmToken
        ], merge: true)
    }
}
