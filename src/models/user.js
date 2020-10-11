const mongoose = require('../db/mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    googleId: {
        type: String
    }
});

const User = mongoose.model('User', userSchema);

User.findByEmail = async (email, cb) => {
    const res = await User.findOne({email});

    if (!res) {
        return cb('Email not found');
    }
    else {
        return cb(null, res);
    }
}

User.signIn = async (payload, cb) => {
    User.findByEmail(payload.email, async (err, user) => {
        if (!user) {
            cb('Email not found');
        } else {
            if (payload.type === 'local') {
                if (payload.password !== user.password) {
                    return cb('Invalid password');
                }
            } else if (payload.type === 'google') {
                if (payload.googleId !== user.googleId) {
                    return cb('Invalid 3rd party ID');
                }
            }
            
            return cb(null, user);
        }
    })   
}

User.create = async (payload, cb) => {
    User.findByEmail(payload.email, async (err, user) => {
        if (user) {
            return cb('Email already exists!');
        }
        else {
            if (payload.type === 'local') {
                newUser = new User({
                    email: payload.email,
                    password: payload.password
                });
            } else if (payload.type === 'google') {
                newUser = new User({
                    email: payload.email,
                    googleId: payload.googleId
                });
            }

            await newUser.save();
            return cb(null, newUser);
        }
    })   
}

module.exports = User;


// This is a non-mongo db example:

// var records = [
//     { id: 1, username: 'jack', password: 'a', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
//   , { id: 2, username: 'jill', password: 'b', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
// ];

// exports.findById = (id, cb) => {
//     process.nextTick(() => {
//         var idx = id - 1;
//         if (records[idx]) {
//             cb(null, records[idx]);
//         } else {
//             cb(new Error('User ' + id + ' does not exist'));
//         }
//     });
// }

// exports.findByUsername = (username, cb) => {
//     process.nextTick(() => {
//         for (var i = 0, len = records.length; i < len; i++) {
//             var record = records[i];
//             if (record.username === username) {
//                 console.log('found record: ');
//                 console.log(record);
//                 return cb(null, record);
//             }
//         }
//         return cb(null, null);
//     });
// }
