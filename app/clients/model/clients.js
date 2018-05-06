const mongoose  = require('mongoose');

const clientSchema = mongoose.Schema({
    profilePhoto : String,
    email        : String,
    name         : String,
    age          : String,
    birthday     : Date,
    address      : String,
    phone        : String
});

module.exports = mongoose.model('Client', clientSchema);