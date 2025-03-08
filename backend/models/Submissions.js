import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Submissions extends Model {}

Submissions.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        contestId : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        problemId : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tokens: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        submissionUid: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'Submissions',
    }
);


export default Submissions;