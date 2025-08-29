const cass = require('cassandra-driver');

const client = new cass.Client({
    contactPoints: ['localhost'],
    localDataCenter: 'datacenter1',
    keyspace: 'collab_doc'
});

module.exports = client;