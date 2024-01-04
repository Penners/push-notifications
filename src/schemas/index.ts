import { z } from "zod";

export const NotificationSchema = z.object({
  title: z.string(),
  options: z.object({
    badge: z.string().url().optional(),
    body: z.string().optional(),
    data: z.any().optional(),
    dir: z.enum(["auto", "ltr", "rtl"]).optional(),
    lang: z.string().optional(),
    image: z.string().url().optional(),
    tag: z.string().optional(),
    icon: z.string().optional(),
    vibrate: z.array(z.number()).optional(),
    actions: z
      .array(
        z.object({
          action: z.string(),
          icon: z.string().optional(),
          title: z.string(),
        })
      )
      .optional(),
  }),
});

export type PublishNotificationType = z.infer<typeof NotificationSchema>;

export const SendPushRequest = z.object({
  topic: z.string(),
  notification: NotificationSchema,
});

export type SendPushRequestType = z.infer<typeof SendPushRequest>;
