var records = [
    { id: 1, username: 'jack', password: 'a', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', password: 'b', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
];

exports.findById = (id, cb) => {
    process.nextTick(() => {
        var idx = id - 1;
        if (records[idx]) {
            cb(null, records[idx]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
}

exports.findByUsername = (username, cb) => {
    process.nextTick(() => {
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === username) {
                console.log('found record: ');
                console.log(record);
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
}