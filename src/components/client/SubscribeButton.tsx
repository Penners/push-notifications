"use client";

const subscribe = async (topic?: string) => {
  const result = await Notification.requestPermission();
  if (result === "denied") {
    console.error("The user explicitly denied the permission request.");
    return;
  }
  if (result === "granted") {
    console.info("The user accepted the permission request.");
  }
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    console.log("no service worker!");
    return;
  }
  let subscription = await registration!.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC as string,
    });
  }

  if (subscription) {
    const res = await fetch("/api/subscribe", {
      credentials: "same-origin",
      method: "post",
      body: JSON.stringify({
        topic,
        subscription,
      }),
    })
      .then((x) => x.json())
      .then((c) => console.log("Subscribed topic: ", c));
  }
};

export const SubscribeButton: React.FC<{ topic: string }> = ({ topic }) => {
  return (
    <button
      role="button"
      className="btn btn-primary"
      onClick={() => subscribe(topic)}
    >
      Subscribe
    </button>
  );
};
