const PostgresDriver = require('@cubejs-backend/postgres-driver');

module.exports = {
  // Provides distinct identifiers for each tenant which is used as caching key
  contextToAppId: ({ securityContext }) =>
    `CUBEJS_APP_${securityContext.tenant}`,

  // Selects the database connection configuration based on the tenant name
  driverFactory: ({ securityContext } = {}) => {
    if (securityContext.tenant === 'Avocado Inc') {
      return new PostgresDriver({
        database: 'localDB',
        host: 'postgres',
        user: 'postgres',
        password: 'example',
        port: '5432',
      });
    } else {
      return new PostgresDriver({
        database: 'ecom',
        host: 'demo-db.cube.dev',
        user: 'cube',
        password: '12345',
        port: '5432',
      });
    }
  },
};
