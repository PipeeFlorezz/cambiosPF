const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Alumnos = require('../models/alumnos');

const router = new Router();

router.get('/alumnos', verify, async (req, res) => {
    console.log('req.user: ' + req.user);

    let alumnos = await Alumnos.find().sort('-createdAt');
    return res.json(alumnos);
    
});



router.get('/alumno/:id', verify, async (req, res) => {
    let userId = req.params.id;
    console.log('ruta de usuario: ' + userId)
    if(req.params.id){
        let alumno = await Alumnos.findOne({ _id: userId });
        console.log('ruta de usuario, Userupdated: ' + user);
        return res.json({alumno});
    }else {
        return res.json({noId: 'No se encuntra el parametro id'})
    }
});



router.post('/crearALumno', async (req, res) => {
    console.log('req.body del formulario registro')
    console.log(req.body);
    let params = req.body;
    if (params.email && params.email.length >= 1) {
        let alumno = await Alumnos.findOne({email: params.email});
        if(alumno){
            return res.json({yaExiste: 'Este usuario ya existe, registrate con otro'})
        }else {
            let alumno = new Alumnos(); 
            alumno.email = params.email;
            alumno.nombre = params.nombre;
            alumno.apellido = params.apellido;
            alumno.edad = params.edad;
            alumno.pais = params.pais;
            alumno.sexo = params.sexo;
            alumno.clave = await alumno.encryptPassword(params.clave);
            let AlumnoGuardado = await alumno.save();
            let Token = await jwt.sign({ id: AlumnoGuardado._id }, 'secretkey');
            return res.json({alumnoGuardado: AlumnoGuardado, token: Token});
        }
    } else {
        return res.json({ noDatos: 'Es obligatorio mandar los datos, envialos' });
    }
});

router.post('/loguinUsuario', async (req, res) => {
    console.log(req.body);
    if (req.body.email && req.body.email.length >= 1) {
        let alumno = await Alumnos.findOne({ email: req.body.email});

        if (!alumno) return res.json({ noUser: 'Este Usuario no existe, registrate' });

        if (alumno) {
            let token = await jwt.sign({ id: alumno._id }, 'secretkey');
            return res.json([alumno, token]);
        }
    }else {
        return res.json({noDatos: 'Datos incompletos'})
    }

});


router.put('/alumno/editar/:id', verify, async (req, res) => {
    let body = req.body;
    let  id  = req.params.id;
    console.log(body, id);
    if(id){
        let usuarioActualizado = 
        await Alumnos.findByIdAndUpdate({_id: req.params.id}, {
            email: body.email,
            nombre: body.nombre,
            apellido: body.apellido,
            edad: body.edad,
            pais: body.pais,
            sexo: body.sexo
        }, {new:true});
        
        return res.json({usuarioActualizado});
    }else {
        return res.json({noId: 'no hay id en la url'});
    }
});

router.delete('/alumno/delete/:id', verify, async (req, res) => {
    if(req.params.id){
       let alumnoELiminado = await Alumnos.findByIdAndDelete(req.params.id);
       return res.json({alumnoELiminado});
    }else{
        return res.json({noId: 'Ha ocurrido un error, no id encontrado'});
    }
});

async function verify(req, res, next) {
    if (!req.headers.authorization) return res.json({ noToken: 'No hay token desde rutas alumnos' });

    let token = req.headers.authorization.replace(/['"]+/g, '');
    if (token && token.length >= 10) {
        console.log('Token desde el verify Funcion: ' + token);
        let verifyToken = await jwt.verify(token, 'secretkey');
        console.log('token desde alumnos rutas' + verifyToken);
        if (verifyToken) req.user = verifyToken.id;
        console.log('verify token: ' + req.user)
    }else {
        return res.json({noToken: token})
    }
    next();
}

module.exports = router;