const cassandra = require('cassandra-driver');
const dbConfig = require('../config/database');
const logger = require('logger').createLogger('app.log');

const baseClient = new cassandra.Client({
    contactPoints: dbConfig.contactPoints,
    localDataCenter: dbConfig.localDataCenter,
    credentials: dbConfig.credentials,
    pooling: dbConfig.pooling
});

const client = new cassandra.Client({
    ...dbConfig,
    keyspace: dbConfig.keyspace
});

async function checkConnection() {
    try {
        await baseClient.connect();
        logger.info('Connected to Cassandra cluster');
        return true;
    } catch (error) {
        logger.error('Failed to connect to Cassandra cluster', error);
        return false;
    }
}

async function closeConnection() {
    try {
        await client.shutdown();
        await baseClient.shutdown();
        logger.info('Close connections to Cassandra');
    } catch (err) {
        logger.error('Error closing Cassandra connections', err);
    }
}

async function createKeyspaceIfNotExists() {
    try {
        await baseClient.execute(`
        CREATE KEYSPACE IF NOT EXISTS ${dbConfig.keyspace}
        WITH REPLICATION = { 
        'class' : 'SimpleStrategy', 
        'replication_factor' : 1 
        }    
        `)
        logger.info(`Keyspace ${dbConfig.keyspace} created or already exists`);
        return true;
    } catch (error) {
        logger.error(`Failed to create keyspace ${dbConfig.keyspace}`, error);
        return false;
    }
}

module.exports = {
    baseClient,
    client,
    checkConnection,
    closeConnection,
    createKeyspaceIfNotExists
};