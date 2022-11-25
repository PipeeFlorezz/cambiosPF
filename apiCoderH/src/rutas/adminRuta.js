const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Administrador = require('../models/admin');

const router = new Router();

router.post('/createAdmin', async (req, res) => {
    
    let body = req.body;
    console.log(body);
    if(body.nombre && body.nombre.length >= 1){
       let admin = await Administrador.findOne({nombre: body.nombre})
        if(!admin){
            let Admin = await new Administrador();
            Admin.nombre = body.nombre;
            Admin.clave = await Admin.encryptPassword(body.clave);
            let administrador = await Admin.save();
            let Token = await jwt.sign({ id: administrador._id }, 'secretkey');
            return res.status(200).json({Admin: administrador, token: Token});
        }else {
                
            console.log('Admin logueado :)');
            let tkn = await jwt.sign({ id: admin._id }, 'secretkey');

            return res.status(200).json({Admin: admin, token: tkn });
                 
        }

    }    
});

module.exports = router;