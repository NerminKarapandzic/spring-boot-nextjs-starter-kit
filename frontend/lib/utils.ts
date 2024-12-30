import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import httpClient from "./httpClient";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function subscribeToNotifications() {
  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js"
    );
    await navigator.serviceWorker.ready;

    registration.active?.postMessage({ type: "CONFIG", apiUrl: process.env.NEXT_PUBLIC_BASE_URL });

    // Get push subscription
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });

    // Send subscription to backend
    try {
      await httpClient.post(
        "/api/notifications/subscribe",
        {
          endpoint: subscription.endpoint,
          p256dh: arrayBufferToBase64(subscription.getKey("p256dh")!),
          auth: arrayBufferToBase64(subscription.getKey("auth")!),
        }
      );
    } catch (error) {
      console.error("Error sending subscription to backend:", error);
      throw error;
    }

    return subscription;
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
    throw error;
  }
}

// Helper function to convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  // Convert ArrayBuffer to byte array
  const bytes = new Uint8Array(buffer);
  // Convert byte array to string
  const binary = bytes.reduce((str, byte) => str + String.fromCharCode(byte), '');
  // Convert binary string to base64
  return btoa(binary);
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
