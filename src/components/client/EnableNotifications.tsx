"use client";
import { usePermission } from "@react-hookz/web";
import React, { useEffect, useState } from "react";
import { SubscribeButton } from "./SubscribeButton";
import { PublishNotificationType, SendPushRequestType } from "@/schemas";

export const EnableNotification = () => {
  const status = usePermission({ name: "notifications" });
  const [topic, setTopic] = useState<string>("");

  const sendTest = () => {
    const RequestBody: SendPushRequestType = {
      topic,
      notification: {
        title: "Test",
        options: {
          body: "Hello World!",
          actions: [
            {
              action: "Click Me!",
              title: "yes",
            },
            {
              action: "Don't click Me!",
              title: "no",
            },
          ],
          data: {
            odds: {
              foo: "bar",
              memes: [
                {
                  yes: true,
                  timestamp: new Date(),
                },
              ],
            },
          },
        },
      },
    };

    fetch("/api/push", {
      credentials: "same-origin",
      method: "post",
      body: JSON.stringify(RequestBody),
    })
      .then((res) => res.json())
      .then((a) => console.log(a))
      .catch((a) => console.error(a));
  };

  return (
    <div>
      <div>
        Notifications status: <code>{status}</code>
      </div>
      <div>
        {status === "prompt" ? (
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              Notification.requestPermission().then((permission) => {
                console.log(permission);
              });
            }}
          >
            Request notifications permission
          </button>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                className="input input-primary"
                type="text"
                placeholder="topic"
                name={"topic"}
                value={topic}
                onChange={(e) => setTopic(e.currentTarget.value)}
              />
              <SubscribeButton topic={topic} />
            </div>
            <div>
              <h2>Send a test</h2>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  sendTest();
                }}
              >
                Send Test
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
