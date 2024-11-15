import { z } from 'astro/zod';
import { notionPageSchema, propertySchema } from 'notion-astro-loader/schemas';

export const ConferenceSchema = z.object({
  name: propertySchema.title,
  date: propertySchema.date.optional(),
  website: propertySchema.url.optional(),
});
export const ConferencesPageSchema = notionPageSchema({
  properties: ConferenceSchema,
});
export type Conference = z.infer<typeof ConferenceSchema>;

export const CFPSchema = z.object({
  talk: propertySchema.title,
});
export const CFPsPageSchema = notionPageSchema({
  properties: CFPSchema,
});
export type CFP = z.infer<typeof CFPSchema>;

export const TalkSchema = z.object({
  talk: CFPSchema,
  conference: ConferenceSchema,
  slides: propertySchema.rich_text.optional(),
  video: propertySchema.rich_text.optional(),
  picture: propertySchema.files.optional(),
  date: propertySchema.date.optional(),
});
export const TalksPageSchema = notionPageSchema({
  properties: z.object({
    talk: propertySchema.relation,
    conference: propertySchema.relation,
    slides: propertySchema.rich_text.optional(),
    video: propertySchema.rich_text.optional(),
    picture: propertySchema.files.optional(),
    date: propertySchema.date.optional(),
  }),
});
export type Talk = z.infer<typeof TalkSchema>;

export function isInstanceOfTalk(talk: any): talk is Talk {
  return (talk as Talk).talk !== undefined;
}
