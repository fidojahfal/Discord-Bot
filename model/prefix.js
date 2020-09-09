const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userPrefixes = new Schema({
    guildId:{
        type: String
    },
    guildName:{
        type: String
    },
    PREFIX:{
        type: String
    }
})

const prefix = mongoose.model('guildPrefix', userPrefixes)
module.exports = prefix