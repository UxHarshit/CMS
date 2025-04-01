// database.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('cms_db', 'cms_user', 'Password@7890', {
  host: '156.67.110.226',
  dialect: 'mysql',
  logging: false, // Disable logging for cleaner output
  pool: {
    max: 10,
    min: 0,
    idle: 10000, // Set the maximum time, in milliseconds, that a connection can be idle before being released
    acquire: 30000 // Set the maximum time, in milliseconds, that pool will try to get connection before throwing error
  }
});

// Test the connection
try {
  await sequelize.authenticate();
  console.log('Connection established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize;
