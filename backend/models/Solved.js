import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Solved extends Model { }

Solved.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        problemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        contestId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Solved',
    }
);

export default Solved;