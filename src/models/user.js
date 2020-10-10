const mongoose = require('mongoose');

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


const User = mongoose.model('User', userSchema);

// User.findById = (id, cb) => {
    
//     // process.nextTick(() => {
//         var idx = id - 1;
//         if (records[idx]) {
//             cb(null, records[idx]);
//         } else {
//             cb(new Error('User ' + id + ' does not exist'));
//         }
//     // });
// }

User.findByEmail = async (email, cb) => {
    // process.nextTick(() => {
    //     for (var i = 0, len = records.length; i < len; i++) {
    //         var record = records[i];
    //         if (record.username === username) {
    //             console.log('found record: ');
    //             console.log(record);
    //             return cb(null, record);
    //         }
    //     }
    //     return cb(null, null);
    // });
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
            }
            
            return cb(null, user);
        }
    })   
}

// User.findOrCreate = async(payload, cb) => {
//     User.findByEmail(payload.email, async (err, user) => {

//         if (!user) {
//             let newUser = null;
//             if (payload.type === 'google') {
//                 newUser = new User({
//                     email: payload.email,
//                     googleId: payload.googleId
//                 })
//             }

//             else if (payload.type === 'local') {
//                 newUser = new User({
//                     email: payload.email,
//                     password: payload.password
//                 })
//             }

//             await newUser.save();
//             return cb(null, newUser);
//         } else {
//             if (payload.type === 'google') {
//                 if (user.googleId !== payload.googleId) {
//                     return cb('invalid 3rd party id')
//                 }
//             }
//             else if (payload.type === 'local') {
//                 if (user.password !== payload.password) {
//                     return cb('invalid password');
//                 }
//             }

            
//             return cb(null, user);
//         }
//     })   
// }

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
                })
            }

            await newUser.save();
            return cb(null, newUser);
        }
    })   
}

module.exports = User;