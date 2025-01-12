import sequelize from '../config/database.js'; // Your Sequelize instance
import { User, UserProfile } from '../models/index.js'; // Your models
// Sync function
const syncDatabase = async () => {
  try {
    // Synchronize all models
    await sequelize.sync({ alter: true }); // Use alter: true for safe updates without dropping tables
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error syncing the database:', error);
  }
};

// Call the sync function
syncDatabase();
