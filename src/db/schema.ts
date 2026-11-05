import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, real, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  stageId: text('stage_id').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  tag: text('tag').default('General'),
  structureId: text('structure_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const presets = pgTable('presets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  stageId: text('stage_id').notNull(),
  name: text('name').notNull(),
  sliceAxis: text('slice_axis').default('none'),
  slicePosition: real('slice_position').default(0),
  explodedView: real('exploded_view').default(0),
  transparentOuterLayers: boolean('transparent_outer_layers').default(false),
  showLabels: boolean('show_labels').default(true),
  autoRotate: boolean('auto_rotate').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const stageProgress = pgTable('stage_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  stageId: text('stage_id').notNull(),
  isMastered: boolean('is_mastered').default(false),
  quizScore: integer('quiz_score').default(100),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const discussions = pgTable('discussions', {
  id: serial('id').primaryKey(),
  authorUid: text('author_uid').notNull(),
  authorName: text('author_name').notNull(),
  stageId: text('stage_id').notNull(),
  structureName: text('structure_name'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes),
  presets: many(presets),
  progress: many(stageProgress),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));

export const presetsRelations = relations(presets, ({ one }) => ({
  user: one(users, {
    fields: [presets.userId],
    references: [users.id],
  }),
}));

export const progressRelations = relations(stageProgress, ({ one }) => ({
  user: one(users, {
    fields: [stageProgress.userId],
    references: [users.id],
  }),
}));
