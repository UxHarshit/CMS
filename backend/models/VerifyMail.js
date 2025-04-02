import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class VerifyMail extends Model { }

VerifyMail.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        OTP: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        resendDate: {
            type: DataTypes.DATE,
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
