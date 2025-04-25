const Sequelize = require('sequelize');
const { DATABASE_URL } = require('./config');

const { Umzug, SequelizeStorage } = require('umzug');

const sequelize = new Sequelize(DATABASE_URL);

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Sequelize connection authenticated");
        await runMigrations();
        console.log('Connected to the database');
    }catch (e) {
        console.log("Failed to connect to the database");
        console.log(e);
        return process.exit(1);
    }

    return null;
}

const migrationConf = {
    migrations: {
        glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations'}),
    context: sequelize.getQueryInterface(),
    logger: console
}

const runMigrations = async () => {
    const migrator = new Umzug(migrationConf);
    console.log("Running migrations...");
    const migrations = await migrator.up();
    console.log('Migrations up to date', {
        files: migrations.map(m => m.name)
    })
}

const rollbackMigrations = async () => {
    await sequelize.authenticate();
    const migrator = new Umzug(migrationConf);
    await migrator.down();
}

module.exports = {
    sequelize,
    connectToDatabase,
    rollbackMigrations
}