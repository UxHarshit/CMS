import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class VerifyMail extends Model { }

VerifyMail.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiry: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'VerifyMail',
    }
);

export default VerifyMail;
