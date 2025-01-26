import User from "./User.js";
import UserProfile from "./UserProfile.js";
import Institution from "./Institution.js";
import Contests from "./Contests.js";
import Problems from "./Problems.js";
import Contest_Problems from "./Contest_Problems.js";
import TestCases from "./TestCases.js";
import UserRole from "./UserRole.js";
import Contest_Participants from "./Contest_Participants.js";
import Logs from "./Logs.js";


User.hasOne(UserProfile, {
    foreignKey: 'userId',
    as: 'profile',
    onDelete: 'CASCADE',
});

UserProfile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
});

User.belongsTo(Institution, {
    foreignKey: 'institutionId',
    as: 'institution',
    onDelete: 'CASCADE',
});

Institution.hasMany(User, {
    foreignKey: 'institutionId',
    as: 'users',
    onDelete: 'CASCADE',
});

Institution.hasMany(Contests, {
    foreignKey: 'institutionId',
    as: 'contests',
    onDelete: 'CASCADE',
});

Contests.belongsTo(Institution, {
    foreignKey: 'institutionId',
    as: 'institution',
    onDelete: 'CASCADE',
});

Contests.belongsToMany(Problems, {
    through: Contest_Problems,
    foreignKey: 'contestId',
    as: 'problems',
    onDelete: 'CASCADE',
});

Problems.belongsToMany(Contests, {
    through: Contest_Problems,
    foreignKey: 'problemId',
    as: 'contests',
    onDelete: 'CASCADE',
});

Contest_Problems.belongsTo(Contests, {
    foreignKey: 'contestId',
    as: 'contest',
    onDelete: 'CASCADE',
});

Contest_Problems.belongsTo(Problems, {
    foreignKey: 'problemId',
    as: 'problem',
    onDelete: 'CASCADE',
});

Problems.hasMany(TestCases, {
    foreignKey: 'problemId',
    as: 'testCases',
    onDelete: 'CASCADE',
});

TestCases.belongsTo(Problems, {
    foreignKey: 'problemId',
    as: 'problem',
    onDelete: 'CASCADE',
});

Contests.hasMany(Contest_Participants, {
    foreignKey: 'contestId',
    as: 'participants',
    onDelete: 'CASCADE',
});

Contest_Participants.belongsTo(Contests, {
    foreignKey: 'contestId',
    as: 'contest',
    onDelete: 'CASCADE',
});

User.hasMany(Contest_Participants, {
    foreignKey: 'userId',
    as: 'participants',
    onDelete: 'CASCADE',
});

Contest_Participants.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
});


User.hasMany(UserRole, {
    foreignKey: 'userId',
    as: 'roles',
    onDelete: 'CASCADE',
});

UserRole.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
});



export { User, UserProfile, Institution, Contests, Problems, Contest_Problems, TestCases , Contest_Participants, UserRole, Logs };