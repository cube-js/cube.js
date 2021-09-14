const PostgresDriver = require('@cubejs-backend/postgres-driver');

module.exports = {
  driverFactory: ({ dataSource }) => {
    if (dataSource === 'suppliers') {
      return new PostgresDriver({
        database: 'recipes',
        host: '35.188.28.4',
        user: 'cube',
        password: '12345',
        port: '5432',
      })
    }

    if (dataSource === 'products') {
      return new PostgresDriver({
        database: 'ecom',
        host: 'demo-db.cube.dev',
        user: 'cube',
        password: '12345',
        port: '5432',
      })
    }

    throw new Error('dataSource is undefined');
  },
};
