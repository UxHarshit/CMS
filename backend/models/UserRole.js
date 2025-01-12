import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class UserRole extends Model { }

UserRole.init(
    {
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        permissions: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('permissions');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('permissions', JSON.stringify(value));
            },
        },
    },
    {
        sequelize,
        modelName: 'UserRole',
    }
);


export default UserRole;