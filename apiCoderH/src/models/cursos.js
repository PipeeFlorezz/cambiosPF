const { Schema, model} = require('mongoose');


const cursoSchema = new Schema({
    profesor: String,
    nombre: String,
    inicia: Date,
    finaliza: Date,
    estudiantes: [{type: Schema.ObjectId, ref: 'Alumno'}],
    imagen: String,
    inscripcion: Boolean
}, {
    versionkey: false,
    timestamps: true
});


module.exports = model('Curso', cursoSchema);

