const { Schema, model} = require('mongoose');
let bcrypt = require('bcryptjs');

const schemaAdmin = new Schema({
    nombre: String,
    clave: String
}, {
    timestamps: true,
    versionkey: false
});

schemaAdmin.methods.encryptPassword = async (password) => {
    let salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

schemaAdmin.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = model('Admin', schemaAdmin);