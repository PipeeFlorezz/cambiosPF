const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Database
require('./database');

// Settings
app.set('port', 8080);

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/imgs'),
    filename: (req, filename, cb) => {
        console.log(path.extname(filename.originalname)
        )
        cb(null, '' + new Date().getMilliseconds() + path.extname(filename.originalname));
    }
});

//midelwares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(multer({storage}).single('imagen'));
// rutas
app.use(require('./rutas/alumnosRutas'));
app.use(require('./rutas/cursosRutas'));
app.use(require('./rutas/adminRuta'));


// archivos estaticos
app.use('/', express.static(path.resolve('src/public')));

app.listen(app.get('port'), () => {
    console.log('node en el puerto: ' + app.get('port'));
    console.log('Objeto __dirname: ' + __dirname);
    console.log('PathResolve: ' + path.resolve());
});


