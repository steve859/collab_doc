const { client } = require('./connection');
const logger = require('logger').createLogger('app.log');

/**
 *
 *
 * @return {Promise<boolean>} True if create successfully
 */
async function createTables() {
    try {
        await client.execute(
            `
            CREATE TABLE IF NOT EXISTS documents (
                doc_id uuid,
                title text,
                created_at timestamp,
                last_modified timestamp,
                created_by uuid,
                PRIMARY KEY (doc_id)
            )
        `
        );
        logger.info('Table "document created or existed"');
        await client.execute(
            `
            CREATE TABLE IF NOT EXISTS documents_by_user (
                user_id uuid,
                doc_id uuid,
                title text,
                last_modified timestamp,
                PRIMARY KEY (user_id, doc_id)
            )
            `
        );
        logger.info('Table "document_by_users" create or existed');
        await client.execute(
            `
            CREATE TABLE IF NOT EXISTS active_users (
                doc_id uuid,
                user_id uuid,
                username text,
                last_seen timestamp,
                PRIMARY KEY (doc_id, user_id)
            )
            `
        );
        logger.info('Table "active_users" create or existed');
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
        logger.info('Table "operations" created or already exists');

        await client.execute(`
            CREATE TABLE IF NOT EXISTS document_locks (
                doc_id uuid,
                section text,
                locked_by uuid,
                locked_at timestamp,
                PRIMARY KEY (doc_id, section)
            )
            `);
        logger.info('Table "document_locks" created or already exists');
        await client.execute(`
        CREATE TABLE IF NOT EXISTS schema_version (
            key text PRIMARY KEY,
            version int,
            last_migration timestamp
        )
        `);
        logger.info('Table "schema_version" created or already exists');
        return true;
    } catch (err) {
        logger.info('Error creating tables: ', err);
        return false;
    }
}

async function dropAllTables() {
    if (process.env.NODE_ENV !== 'development') {
        logger.warn('Attempted to drop tables in non-development environment');
        return false;
    }
    try {
        const tables = [
            'documents',
            'documents_by_user',
            'active_users',
            'operations',
            'document_locks',
            'schema_version'
        ];

        for (const table of tables) {
            await client.execute(`DROP TABLE IF EXISTS ${table}`);
            logger.info(`Table "${table}" dropped`);
        }

        return true;
    } catch (error) {
        logger.error('Error dropping tables:', error);
        return false;
    }
}

module.exports = {
    createTables,
    dropAllTables
}