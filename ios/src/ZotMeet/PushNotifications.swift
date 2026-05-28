import UIKit
import WebKit
import FirebaseMessaging

func registerForPushNotifications() {
    DispatchQueue.main.async {
        UIApplication.shared.registerForRemoteNotifications()
    }
}

private let pushPayloadKeys: Set<String> = [
    "type", "redirect", "title", "message", "groupId", "createdBy",
]

func pushFieldString(_ value: Any?) -> String? {
    guard let value = value else { return nil }

    if let string = value as? String {
        let trimmed = string.trimmingCharacters(in: .whitespacesAndNewlines)
        return trimmed.isEmpty ? nil : trimmed
    }
    if let string = value as? NSString {
        let trimmed = string.trimmingCharacters(in: .whitespacesAndNewlines)
        return trimmed.isEmpty ? nil : trimmed
    }
    if let number = value as? NSNumber {
        return number.stringValue
    }
    if let bool = value as? Bool {
        return bool ? "true" : "false"
    }
    return nil
}

private func pushPayloadKeyName(_ key: AnyHashable) -> String? {
    if let key = key as? String {
        return key
    }
    if let key = key as? NSString {
        return key as String
    }
    return nil
}

private func mergePushFields(
    into payload: inout [String: String],
    from record: [AnyHashable: Any]
) {
    for (rawKey, value) in record {
        guard let key = pushPayloadKeyName(rawKey), pushPayloadKeys.contains(key) else {
            continue
        }
        if payload[key] != nil {
            continue
        }
        if let string = pushFieldString(value) {
            payload[key] = string
        }
    }
}

func pushPayloadForWebView(userInfo: [AnyHashable: Any]) -> [String: String] {
    var payload = [String: String]()
    mergePushFields(into: &payload, from: userInfo)

    if let nested = userInfo[AnyHashable("data")] as? [AnyHashable: Any] {
        mergePushFields(into: &payload, from: nested)
    }

    return payload
}

func returnPermissionResult(isGranted: Bool){
    DispatchQueue.main.async(execute: {
        if (isGranted){
            ZotMeet.webView.evaluateJavaScript("this.dispatchEvent(new CustomEvent('push-permission-request', { detail: 'granted' }))")
        }
        else {
            ZotMeet.webView.evaluateJavaScript("this.dispatchEvent(new CustomEvent('push-permission-request', { detail: 'denied' }))")
        }
    })
}
func returnPermissionState(state: String){
    DispatchQueue.main.async(execute: {
        ZotMeet.webView.evaluateJavaScript("this.dispatchEvent(new CustomEvent('push-permission-state', { detail: '\(state)' }))")
    })
}

func handlePushPermission() {
    UNUserNotificationCenter.current().getNotificationSettings () { settings in
        switch settings.authorizationStatus {
        case .notDetermined:
            let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
            UNUserNotificationCenter.current().requestAuthorization(
                options: authOptions,
                completionHandler: { (success, error) in
                    if error == nil {
                        if success == true {
                            registerForPushNotifications()
                            returnPermissionResult(isGranted: true)
                        } else {
                            returnPermissionResult(isGranted: false)
                        }
                    }
                    else {
                        returnPermissionResult(isGranted: false)
                    }
                }
            )
        case .denied:
            returnPermissionResult(isGranted: false)
        case .authorized, .ephemeral, .provisional:
            registerForPushNotifications()
            returnPermissionResult(isGranted: true)
        @unknown default:
            return;
        }
    }
}
func handlePushState() {
    UNUserNotificationCenter.current().getNotificationSettings () { settings in
        switch settings.authorizationStatus {
        case .notDetermined:
            returnPermissionState(state: "notDetermined")
        case .denied:
            returnPermissionState(state: "denied")
        case .authorized:
            registerForPushNotifications()
            returnPermissionState(state: "authorized")
        case .ephemeral:
            registerForPushNotifications()
            returnPermissionState(state: "ephemeral")
        case .provisional:
            registerForPushNotifications()
            returnPermissionState(state: "provisional")
        @unknown default:
            returnPermissionState(state: "unknown")
            return;
        }
    }
}

func checkViewAndEvaluate(event: String, detail: String) {
    if (!ZotMeet.webView.isHidden && !ZotMeet.webView.isLoading ) {
        DispatchQueue.main.async(execute: {
            ZotMeet.webView.evaluateJavaScript("this.dispatchEvent(new CustomEvent('\(event)', { detail: \(detail) }))")
        })
    }
    else {
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            checkViewAndEvaluate(event: event, detail: detail)
        }
    }
}

func handleFCMToken(){
    DispatchQueue.main.async(execute: {
        Messaging.messaging().token { token, error in
            if let error = error {
                print("Error fetching FCM registration token: \(error)")
                checkViewAndEvaluate(event: "push-token", detail: "ERROR GET TOKEN")
            } else if let token = token {
                print("FCM registration token: \(token)")
                checkViewAndEvaluate(event: "push-token", detail: "'\(token)'")
            }
        }   
    })
}

func sendPushToWebView(userInfo: [AnyHashable: Any]){
    let payload = pushPayloadForWebView(userInfo: userInfo)
    guard !payload.isEmpty else { return }
    var json = "";
    do {
        let jsonData = try JSONSerialization.data(withJSONObject: payload)
        json = String(data: jsonData, encoding: .utf8)!
    } catch {
        print("ERROR: push payload parsing problem")
        return
    }
    checkViewAndEvaluate(event: "push-notification", detail: json)
}

func sendPushClickToWebView(userInfo: [AnyHashable: Any]){
    let payload = pushPayloadForWebView(userInfo: userInfo)
    guard !payload.isEmpty else { return }
    var json = "";
    do {
        let jsonData = try JSONSerialization.data(withJSONObject: payload)
        json = String(data: jsonData, encoding: .utf8)!
    } catch {
        print("ERROR: push payload parsing problem")
        return
    }
    checkViewAndEvaluate(event: "push-notification-click", detail: json)
}
