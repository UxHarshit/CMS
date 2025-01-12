import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class TestCases extends Model { }

TestCases.init(
    {
        problemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        input: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        output: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate :{
                min : 0
            }
        },
    },
    {
        sequelize,
        modelName: 'TestCases',
        timestamps: false,
    }
);

export default TestCases;