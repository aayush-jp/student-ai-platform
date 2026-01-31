import { pgTable, text, timestamp, uuid, boolean, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk userId
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  imageUrl: text('image_url'),
  selectedDomain: text('selected_domain'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const resources = pgTable('resources', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'), // For AI search
  url: text('url').notNull(),
  type: text('type').notNull(), // 'video', 'article', 'course'
  domain: text('domain').notNull(), // 'software-engineering', 'data-science', 'product-design'
  difficulty: text('difficulty'), // 'Beginner', 'Intermediate', 'Advanced'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userProgress = pgTable(
  'user_progress',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    resourceId: uuid('resource_id')
      .notNull()
      .references(() => resources.id),
    isCompleted: boolean('is_completed').default(false).notNull(),
    lastInteractedAt: timestamp('last_interacted_at').defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.resourceId] }),
  })
);
