let mongoose = require('mongoose');

let roleSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            default: ""
        }
    }, {
    timestamps: true
})

module.exports = mongoose.model('role', roleSchema)
