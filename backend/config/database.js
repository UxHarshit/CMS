// database.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('cms_db', 'cms_user', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Disable logging for cleaner output
});

// Test the connection
try {
  await sequelize.authenticate();
  console.log('Connection established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize;
