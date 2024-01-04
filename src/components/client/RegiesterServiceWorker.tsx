"use client";
import React, { useEffect, useState } from "react";

export const RegiesterServiceWorker = () => {
  const [notification, setNotification] = useState<any>();

  ("use client");
  useEffect(() => {
    navigator.serviceWorker.register("/sw.js").then((registration) => {
      registration.update();
    });

    const messageRef = (ev: MessageEvent<any>) => {
      console.log("message reccieved", ev.data);
      try {
        const data = JSON.parse(ev.data.toString());
        console.log(data);
        setNotification({
          ...data,
          wtf: true,
        });
      } catch (e) {
        console.log("something went wrong :(");
      }
    };
    navigator.serviceWorker.addEventListener("message", messageRef);

    return () => {
      navigator.serviceWorker.removeEventListener("message", messageRef);
    };
  }, [setNotification]);

  return (
    <pre>
      <code>{JSON.stringify(notification, null, 2)}</code>
    </pre>
  );
};
