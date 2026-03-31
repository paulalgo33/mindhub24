import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    author: z.string().default('Александра'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string(),
    coverImage: z.string().optional(),
    slug: z.string().optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
    published: z.boolean().default(true),
  }),
});

export const collections = { blog };
