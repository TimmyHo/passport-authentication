const mongoose = require('mongoose');

let mongoDbUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/passport-authentication';

mongoose.connect(mongoDbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

module.exports = mongoose;