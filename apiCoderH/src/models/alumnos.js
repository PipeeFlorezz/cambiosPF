const { model, Schema } = require('mongoose');
let bcrypt = require('bcryptjs');
const alumnoSchema = new Schema({
    email: String,
    nombre: String,
    apellido: String,
    edad: Number,
    pais: String,
    sexo: String,
    clave: String
}, {
    timestamps: true,
    versionkey: false
});

alumnoSchema.methods.encryptPassword = async (password) => {
    let salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

alumnoSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = model('Alumno', alumnoSchema);