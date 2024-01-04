// @ts-check

/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope & typeof globalThis} */ (
  globalThis
);

sw.addEventListener("install", (event) => {
  console.log("Service Worker installed ⚡");
});

sw.addEventListener("push", (event) => {
  const message = event.data?.json();
  const { title, options } = message;

  async function handlePushEvent() {
    await sw.registration.showNotification(title, options);
  }
  event.waitUntil(handlePushEvent());
});

sw.addEventListener("notificationclick", (event) => {
  const notification = event.notification;

  const payload = {
    notification: {
      data: notification.data,
      title: notification.title,
      tag: notification.tag,
      //@ts-ignore trust me bro
      actions: notification.actions,
    },
    action: event.action,
  };

  console.log("payload", payload);
  notification.close();

  async function handleNotificationClick() {
    const windowClients = await sw.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

    const client =
      windowClients.find((client, index) => {
        return client.visibilityState === "visible";
      }) || (await sw.clients.openWindow("/"));

    if (client) {
      client.focus().catch(() => {
        console.log("client already focused or error");
      });

      client.postMessage(JSON.stringify(payload));
    }
  }

  event.waitUntil(handleNotificationClick());
});
