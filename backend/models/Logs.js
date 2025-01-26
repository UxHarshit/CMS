import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Logs extends Model { }

Logs.init(
    {
        event_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        endpoint: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ip_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_agent: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        details: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Logs',
    }
);

export default Logs;