const { baseClient, client, checkConnection, closeConnection, createKeyspaceIfNotExists } = require('./connection');
const { createTables } = require('./schema');
const logger = require('logger').createLogger('app.log');
const { runMigration, getCurrentSchemaVersion } = require('./migration');
const { keyspace } = require('../config/database');



/**
 *
 *
 * @return {Promise<boolean>} 
 */
async function initializeDatabase() {
    try {
        logger.info("Starting initialize database");
        const connected = await checkConnection();
        if (!connected) {
            throw new Error('Failed to connect to Cassandra');
        }
        const keyspaceCreated = await createKeyspaceIfNotExists();
        if (!keyspaceCreated) {
            throw new Error('Failed to create keyspace');
        }

        await client.connect();
        logger.info('Connected to keyspace');

        const tablesCreated = await createTables();
        if (!tablesCreated) {
            throw new Error('Failed to create tables');
        }

        const migrationSuccessful = await runMigration();
    } catch (err) {
        logger.error('Database initialization failed', err);
        return false;
    }
}