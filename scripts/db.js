const initializeDatabase = require('../database/init');
const { dropAllTables } = require('../database/schema');
const seedDevData = require('../database/seeds/dev_data');
const { closeConnection } = require('../database/connection');
const { logger } = require('../utils/logger');

const command = process.argv[2];

async function main() {
    try {
        switch (command) {
            case 'init':
                await initializeDatabase();
                break;

            case 'reset':
                if (process.env.NODE_ENV !== 'development') {
                    logger.error('Database reset is only allowed in development environment');
                    process.exit(1);
                }
                await dropAllTables();
                await initializeDatabase();
                break;

            case 'seed':
                await seedDevData();
                break;

            default:
                logger.error('Unknown command. Use: init, reset, seed');
                process.exit(1);
        }

        await closeConnection();
        process.exit(0);
    } catch (error) {
        logger.error('Error executing database command:', error);
        process.exit(1);
    }
}

main();