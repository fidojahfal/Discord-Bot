const mongoose = require('mongoose')
var Schema = mongoose.Schema;
const prefixSchema = new Schema({
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

const PREFIX = mongoose.model('prefix', prefixSchema);
module.exports = PREFIX;