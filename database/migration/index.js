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
 * @param {number} version
 * @return {Promise<boolean>} 
 */
async function updateSchemaVersion(version) {
    try {
        await client.execute(
            'UPDATE schema_version SET version = ?, last_migration = ? WHERE key = ?',
            [version, new Date(), 'schema']
        );
        logger.info(`Schema version updated to ${version}`);
        return true;
    } catch (error) {
        logger.error(`Error updating schema version to ${version}:`, error);
        return false;
    }
}

const migrations = [
    require('./001_initial')
]

/**
 *
 * @return {Promise<boolean>}
 */
async function runMigrations() {
    try {
        const currentVersion = await getCurrentSchemaVersion();
        logger.info(`Current schema version : ${currentVersion}`);
        for (let i = currentVersion; i < migrations.length; i++) {
            const migration = migrations[i];
            const targetVersion = i + 1;
            logger.info(`Running migration to version ${targetVersion}:`, migration.description);
            try {
                await migration.up();
                await updateSchemaVersion(targetVersion);
                logger.info(`Successfully migrated to version ${targetVersion}`);
            } catch (err) {
                logger.error(`Migration to version ${targetVersion} failed`, err);
                return false;
            }
        }
        return true;

    } catch (err) {
        logger.error('Error running migration:', err);
        return false;
    }

}

module.exports = {
    getCurrentSchemaVersion,
    updateSchemaVersion,
    runMigrations
}