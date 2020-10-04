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
        return cb('User not found');
    }
    else {
        return cb(null, res);
    }
}

User.findOrCreate = async(payload, cb) => {
    User.findByEmail(payload.email, async (err, user) => {

        if (!user) {
            let newUser = null;
            if (payload.type === 'google') {
                newUser = new User({
                    email: payload.email,
                    googleId: payload.googleId
                })
            }


            await newUser.save();
            cb(null, newUser);
        } else {
            cb(null, user);
        }
    })   
}

module.exports = User;