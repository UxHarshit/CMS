import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Institution extends Model { }


Institution.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Institution',
    }
);

export default Institution;