import webpush from "web-push";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/client";
import { z } from "zod";
import { NotificationSchema, SendPushRequest } from "@/schemas";

const pushSchema = z.object({
  topic: z.string(),
  notification: NotificationSchema,
});

export async function POST(request: NextRequest) {
  try {
    const body = SendPushRequest.parse(await request.json());

    const toSend = await db.query.Subscriptions.findMany({
      where: (table, { eq }) => eq(table.topic, body.topic as string),
      with: {
        subscriber: true,
      },
    });

    const results = await Promise.allSettled(
      toSend.map(async (result) => {
        return webpush.sendNotification(
          {
            endpoint: result.subscriber!.endpoint as string,
            keys: result.subscriber!.keys as any,
          },
          JSON.stringify(body.notification),
          {
            vapidDetails: {
              privateKey: process.env.VAPID_PRIVATE as string,
              publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC as string,
              subject: process.env.VAPID_SUBJECT as string,
            },
          }
        );
      })
    );

    return NextResponse.json({ success: true, results });
  } catch (e) {
    return NextResponse.json(e);
  }
}
