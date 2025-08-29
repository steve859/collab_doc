const cass = require('cassandra-driver');

const initClient = new cass.Client({
    contactPoints: ['localhost'],
    localDataCenter: 'datacenter1'
});

const client = new cass.Client({
    contactPoints: ['localhost'],
    localDataCenter: 'datacenter1',
    keyspace: 'collab_doc'
})

async function createKeyspace() {
    try {
        await initClient.execute(`
            CREATE KEYSPACE IF NOT EXISTS collab_doc
            WITH replication = {'class': 'SimpleStrategy','replication_factor': 1}
            `);
        console.log('Keyspace collab_doc create or already exists');
    } catch (err) {
        console.error('Error creating keyspace', err);
        throw err;
    }
}

async function craeteDocumentsTable() {
    try {
        await client.execute(

        )
    } catch (err) {
        console.error("Error creating documents table", err);
        throw err;
    }
}