const { baseClient, client, checkConnection, closeConnection, createKeyspaceIfNotExists } = require('./connection');
const { createTables } = require('./schema');
const logger = require('logger').createLogger('app.log');
const { runMigration, getCurrentSchemaVersion, runMigrations } = require('./migration');
const { keyspace } = require('../config/database');
const { success } = require('zod');
const { errorMonitor } = require('ws');



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

        const migrationSuccessful = await runMigrations();
        if (!migrationSuccessful) {
            throw new Error('Failed to run migrations');
        }

        const version = await getCurrentSchemaVersion();
        logger.info(`Database initialized successfully. Schema version: ${version}`);
        return true;
    } catch (err) {
        logger.error('Database initialization failed', err);
        return false;
    } finally {
        await baseClient.shutdown();
    }
}

// entry point guard
if (require.main === module) {
    initializeDatabase()
        .then(success => {
            if (success) {
                logger.info('Database setup complete');
                process.exit(0);
            }
            else {
                logger.error("Database setup failed");
                process.exit(1);
            }
        })
        .catch(error => {
            logger.error('Unexpected error during database initialization', error);
            process.exit(1);
        })
}

module.exports = initializeDatabase;