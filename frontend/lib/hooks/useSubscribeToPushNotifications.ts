import { useLocalStorage } from "@mantine/hooks";
import { subscribeToNotifications } from "../utils";
import { restClient } from "../httpClient";

export const useSubscribeToPushNotifications = () => {
  const [subscription, setSubscription] = useLocalStorage<boolean | null>({
    key: "push-subscription",
    defaultValue: null,
    getInitialValueInEffect: false,
  });

  const subscribe = async () => {
    console.log('subscribe', subscription)
    console.log('localStorage', localStorage)
    try {
      if (localStorage && (!subscription || subscription === null)) {
        // Check if notifications are supported
        if (!("Notification" in window) || !("serviceWorker" in navigator)) {
          restClient.pushNotificationRequestDenied({deniedReason: "NOT_SUPPORTED", requestedBy: "ONLOAD" });
          return;
        }

        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          restClient.pushNotificationRequestDenied({deniedReason: "NOT_GRANTED", requestedBy: "ONLOAD" });
          return;
        }

        await subscribeToNotifications();
        setSubscription(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return { subscribe, subscription };
};
