const { client } = require('../connection');

module.exports = {
    description: 'Initial schema setup',

    /**
     * migration
     */
    async up() {
        // documents
        await client.execute(`
      CREATE TABLE IF NOT EXISTS documents (
        doc_id uuid,
        title text,
        created_at timestamp,
        last_modified timestamp,
        created_by uuid,
        PRIMARY KEY (doc_id)
      )
    `);

        // documents_by_user
        await client.execute(`
      CREATE TABLE IF NOT EXISTS documents_by_user (
        user_id uuid,
        doc_id uuid,
        title text,
        last_modified timestamp,
        PRIMARY KEY (user_id, doc_id)
      )
    `);

        // active_users
        await client.execute(`
      CREATE TABLE IF NOT EXISTS active_users (
        doc_id uuid,
        user_id uuid,
        username text,
        last_seen timestamp,
        PRIMARY KEY (doc_id, user_id)
      )
    `);

        // operations
        await client.execute(`
      CREATE TABLE IF NOT EXISTS operations (
        doc_id uuid,
        timestamp timeuuid,
        op_id uuid,
        user_id uuid,
        payload text,
        PRIMARY KEY (doc_id, timestamp, op_id)
      ) WITH CLUSTERING ORDER BY (timestamp DESC, op_id ASC)
    `);

        // document_locks
        await client.execute(`
      CREATE TABLE IF NOT EXISTS document_locks (
        doc_id uuid,
        section text,
        locked_by uuid,
        locked_at timestamp,
        PRIMARY KEY (doc_id, section)
      )
    `);
    },

    /**
     * Drop all tables
     */
    async down() {
        await client.execute('DROP TABLE IF EXISTS document_locks');
        await client.execute('DROP TABLE IF EXISTS operations');
        await client.execute('DROP TABLE IF EXISTS active_users');
        await client.execute('DROP TABLE IF EXISTS documents_by_user');
        await client.execute('DROP TABLE IF EXISTS documents');
    }
};