// models/UserProfile.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import axios from 'axios';

class UserProfile extends Model { }

UserProfile.init(
  {
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    achievements: {
      type: DataTypes.TEXT, // Use TEXT to store larger data
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('achievements');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('achievements', JSON.stringify(value));
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'UserProfile',
    hooks: {
      beforeCreate: async (profile) => {
        if (!profile.location) {
          profile.location = await fetchUserLocation();
        }
      },
    },
  }
);

async function fetchUserLocation() {
  try {
    const { data } = await axios.get('https://ipapi.co/json/'); // Replace with a preferred location API
    return `${data.city}, ${data.region}, ${data.country_name}`;
  } catch (error) {
    console.error('Failed to fetch location:', error.message);
    return null; // Handle cases where location fetch fails
  }
}


export default UserProfile;
