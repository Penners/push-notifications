import { relations } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const Subscribers = sqliteTable("subscribers", {
  id: text("id").primaryKey(),
  endpoint: text("endpoint"),
  keys: text("keys", {
    mode: "json",
  }).$type<{
    p256dh: string;
    auth: string;
  }>(),
});

export const Subscriptions = sqliteTable(
  "subscriptions",
  {
    subscriberId: text("subscriber_id"),
    topic: text("topic"),
  },
  (table) => {
    return {
      pk: primaryKey(table.subscriberId, table.topic),
    };
  }
);

export const SubscrptionsRelations = relations(Subscriptions, ({ one }) => ({
  subscriber: one(Subscribers, {
    fields: [Subscriptions.subscriberId],
    references: [Subscribers.id],
  }),
}));
