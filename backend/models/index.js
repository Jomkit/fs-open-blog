const Blog = require('./blog');
const User = require('./user');
const ReadingList = require('./readingList');

User.hasMany(Blog);
Blog.belongsTo(User);
// Blog.sync({ alter: true });
// User.sync({ alter: true });

User.hasMany(ReadingList);
ReadingList.belongsTo(User);

module.exports = { 
    Blog, User
};