const { client } = require('../connection');
const logger = require('logger').createLogger('app.log');

/**
 *
 *
 * @return {Promise<number> } 
 */
async function getCurrentSchemaVersion() {
    try {
        const result = await client.execute(
            'SELECT version FROM schema_version WHERE key = ?'
            , ['schema']
        );
        if (result.rowLength === 0) {
            await client.execute(
                'INSERT INTO schema_version (key, version, last_migration VALUES  (?,?,?)',
                ['schema', 0, new Date()]
            );
            return 0;
        }
        return result.rows[0].version;
    } catch (err) {
        logger.info('Error getting schema version:', err);
        return -1;
    }
}


/**
 *
 *
 * @param {*} version
 * @return {*} 
 */
async function updateSchemaVersion(version) {
    return 1;
}

async function runMigration() {

}

module.exports = {
    getCurrentSchemaVersion,
    updateSchemaVersion,
    runMigration
}