import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Contest_Participants extends Model { }

Contest_Participants.init(
    {
        contestId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isFirstTime: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        rank: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        is_disqualified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        last_submission_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Contest_Participants',
        timestamps: false,
    }
);

export default Contest_Participants;