/**
 * configured database connection
 */
module.exports = {
    contactPoints: process.env.DB_HOSTS ? process.env.DB_HOSTS.split(',') : ['127.0.0.1'],
    localDataCenter: process.env.DB_DATACENTER || 'datacenter1',
    keyspace: process.env.DB_KEYSPACE || 'collab_doc',
    credentials: process.env.DB_USERNAME && process.env.DB_PASSWORD ? {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    } : undefined,
    pooling: {
        coreConnectionsPerHost: {
            local: 2,
            remote: 1
        },
        maxRequestsPerConnection: 1024
    }
};