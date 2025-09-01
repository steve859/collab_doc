const { z } = require('zod')

const BaseMessageSchema = z.object({
    type: z.string(),
});

const GreetingSchema = BaseMessageSchema.extend({
    type: z.literal('greeting'),
    message: z.string(),
});

const JoinDocumentSchema = BaseMessageSchema.extend({
    type: z.literal('join_document'),
    documentId: z.string,
});

const LeaveDocumentSchema = BaseMessageSchema.extend({
    type: z.literal('leave_document'),
});

const EditShema = BaseMessageSchema.extend({
    type: z.literal('edit'),
    change: z.object({
        insert: z.string().optional(),
        delete: z.string().optional(),
        position: z.number(),
        length: z.number().optional(),
    }),
});

const CursorShema = BaseMessageSchema.extend({
    type: z.literal('cursor_position'),
    position: z.number(),
});

const LockRequestSchema = BaseMessageSchema.extend({
    type: z.literal("lock_request"),
    section: z.string(),
});

const UnlockRequestSchema = BaseMessageSchema.extend({
    type: z.literal("unlock_request"),
    section: z.string(),
});

const MessageSchema = z.union([
    GreetingSchema,
    JoinDocumentSchema,
    LeaveDocumentSchema,
    EditShema,
    CursorShema,
    LockRequestSchema,
    UnlockRequestSchema
])

module.exports = {
    MessageSchema,
}