import { db } from "@/database/client";
import { Subscribers, Subscriptions } from "@/database/schema";
import { NextRequest } from "next/server";
import { z } from "zod";

const SubBody = z.object({
  topic: z.string(),
  subscription: z.object({
    endpoint: z.string(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
});

export async function GET(request: NextRequest) {
  const deviceId = request.cookies.get("x-id")?.value;
  if (!deviceId)
    return Response.json({
      success: false,
    });
  const dbQuery = await db.query.Subscriptions.findMany({
    where: (table, { eq, and }) =>
      and(eq(table.subscriberId, deviceId as string)),
    with: {
      subscriber: true,
    },
  });

  return Response.json({
    success: true,
    dbQuery,
  });
}

export async function POST(request: NextRequest) {
  const deviceId = request.cookies.get("x-id")?.value;
  const body = SubBody.parse(await request.json());

  const subscriber = await db
    .insert(Subscribers)
    .values({
      id: deviceId as string,
      endpoint: body.subscription.endpoint,
      keys: {
        p256dh: body.subscription.keys.p256dh,
        auth: body.subscription.keys.auth,
      },
    })
    .onConflictDoUpdate({
      target: Subscribers.id,
      set: {
        endpoint: body.subscription.endpoint,
        keys: {
          p256dh: body.subscription.keys.p256dh,
          auth: body.subscription.keys.auth,
        },
      },
    })
    .returning()
    .get();

  const subscription = await db
    .insert(Subscriptions)
    .values({
      subscriberId: deviceId,
      topic: body.topic,
    })
    .onConflictDoNothing()
    .returning()
    .get();

  const dbQuery = await db.query.Subscriptions.findFirst({
    where: (table, { eq, and }) =>
      and(
        eq(table.subscriberId, deviceId as string),
        eq(table.topic, body.topic)
      ),
    with: {
      subscriber: true,
    },
  });

  return Response.json({
    success: true,
    dbQuery,
  });
}
