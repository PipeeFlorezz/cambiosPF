const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Cursos = require('../models/cursos');
const Estudiantes = require('../models/alumnos');
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dziadnwao',
    api_key: '987749278362741',
    api_secret: '8KPay_WBFRZmSS4E4kX2ByTChVk'
});

const router = new Router();

router.get('/cursos', verify, async (req, res) => {
    console.log('req.user: ' + req.user);

    let cursos = await Cursos.find().sort('-createdAt').populate('estudiantes');
    return res.json(cursos);
});



router.get('/curso/:id', verify, async (req, res) => {
    let cursoId = req.params.id;
    if(req.params.id){
        let curso = await Cursos.findOne({ _id: cursoId }).populate('estudiantes');
        console.log('ruta de curso: ' + curso);
        return res.json({curso});
    }else {
        return res.json({noId: 'No se encuntra el parametro id'})
    }
});

router.post('/crearCurso', verify,  async (req, res) => {
    console.log(req.file);
    console.log(req.body);
    let body = req.body;
    if(req.file && req.file.filename){
        let cloudimg = '';
        cloudimg = await cloudinary.v2.uploader.upload(req.file.path)
        console.log(req.file);
        console.log(cloudimg.public_id); 
        const curso = new Cursos();
        curso.profesor = body.profesor;
        curso.nombre = body.nombre;
        curso.inicia = body.inicia;
        curso.finaliza = body.finaliza;
        curso.imagen = cloudimg.url;
        curso.inscripcion = body.inscripcion;
        let cursoGuardado = await curso.save();
        return res.json({cursoGuardado});
    }else { 
        const curso = new Cursos();
        curso.profesor = body.profesor;
        curso.nombre = body.nombre;
        curso.inicia = body.inicia;
        curso.finaliza = body.finaliza;
        curso.inscripcion = body.inscripcion;
        let cursoGuardado = await curso.save();
        return res.json({cursoGuardado});
    }
});

router.put('/inscribirEstudiante/:id', verify, async (req, res) => {
    console.log(req.body);
    
    console.log('inscrbir estidiante');
    let body = req.body;
    let id = req.params.id;
    let alumno = await Estudiantes.findOne({email: body.email});
    if(alumno){
        if(body.email && body.email.length >= 1){
            let curso = await Cursos.findOne({_id: id}).populate('estudiantes')
             if(curso && curso.estudiantes.length == 0){
                 let cursoActualizado = await Cursos.findByIdAndUpdate(req.params.id,
                     { $set: { estudiantes: alumno } }, {new: true}).populate('estudiantes')
                 return res.json({cursoActualizado})
             }else {

                 console.log('curso con estudiantes inscritos')
                 console.log(curso);
                 let estudiantesInscritos;
                 estudiantesInscritos = curso.estudiantes;
                 estudiantesInscritos[estudiantesInscritos.length] = alumno;
                 console.log(estudiantesInscritos);
                 
                 let cursoActualizado = await Cursos.findByIdAndUpdate(req.params.id,
                     { $set: { estudiantes: estudiantesInscritos } }, {new: true}).populate('estudiantes')
                     return res.json({cursoActualizado})
             }
         }else {
             return res.json({noEmail: 'No email escrito, escribe un eamil'})
         }
    }else {
        let estudiante = new Estudiantes();
        estudiante.email = body.email;
        estudiante.nombre = body.nombre;
        estudiante.apellido = body.apellido;
        estudiante.edad = body.edad;
        estudiante.pais = body.pais;
        estudiante.sexo = body.sexo;
        estudiante.clave = '';
        let estudianteGuardado = await estudiante.save();
        if(body.email && body.email.length >= 1){
           let curso = await Cursos.findOne({_id: id}).populate('estudiantes')
            if(curso && curso.estudiantes.length == 0){
                let cursoActualizado = await Cursos.findByIdAndUpdate(req.params.id,
                    { $set: { estudiantes: estudianteGuardado } }, {new: true}).populate('estudiantes')
                return res.json({cursoActualizado})
            }else {
                console.log('curso con estudiantes inscritos')
                console.log(curso);
                let estudiantesInscritos;
                estudiantesInscritos = curso.estudiantes;
                estudiantesInscritos[estudiantesInscritos.length] = estudianteGuardado;
                console.log(estudiantesInscritos);
                
                let cursoActualizado = await Cursos.findByIdAndUpdate(req.params.id,
                    { $set: { estudiantes: estudiantesInscritos } }, {new: true}).populate('estudiantes')
                    return res.json({cursoActualizado})
            }
        }else {
            return res.json({noEmail: 'No email escrito, escribe un eamil'})
        }
    }
});

router.put('/curso/editar/:id', verify, async (req, res) => {
    let body = req.body, id = req.params.id;
    if(body.profesor && body.profesor.length >= 1){
        let cursoActualizado = 
        await Cursos.findByIdAndUpdate(id, { 
            profesor: body.profesor,
            nombre: body.nombre,
            inicia: body.inicia,
            finaliza: body.finaliza,
            inscripcion: body.inscripcion
        }, {new:true});
        
        return res.json(cursoActualizado);
    }else {
        return res.json({noDatos: 'Datos incompletos'});
    }
});

router.delete('/curso/delete/:id', async (req, res) => {
    if(req.params.id){
       let cursoELiminado = await Cursos.findByIdAndDelete(req.params.id);
       return res.json({cursoELiminado});
    }else{
        return res.json({noId: 'Ha ocurrido un error, no id encontrado'});
    }
});

async function verify(req, res, next) {
    if (!req.headers.authorization) return res.json({ noToken: 'No hay token desde rutas curso' });

    let token = req.headers.authorization.replace(/['"]+/g, '');
    if (token) {
        console.log('Token desde el verify Funcion: ' + token);
        let verifyToken = await jwt.verify(token, 'secretkey');
        console.log('token en rutas curso' + verifyToken);
        if (verifyToken) req.user = verifyToken.id;
        console.log('req.user es igual a: ' + req.user)
    }
    next();
}

module.exports = router;