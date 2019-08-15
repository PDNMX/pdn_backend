import express from 'express';

const app = express()
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var fileUpload = require('express-fileupload');
require('dotenv').config();


var corsOptions={
    origin:false
};
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//APIS
var indexRouter = require('./routes/index');
var indexSancionados = require('./apis/Sancionados/Servidores/main');
var indexParticularesSancionados = require('./apis/Sancionados/Particulares/main');
var indexRENIRESP = require('./apis/ServidoresIntervienen/servidoresIntervienen');

//CHARTS
var querysSanciondos = require('./charts/sancionados/querysServidores');
var queryPartiuclaresSancionados = require('./charts/sancionados/querysParticulares');
var queryServidoresIntervienen = require('./charts/servidoresIntervienen/queryServidoresIntervienen')

app.use('/', indexRouter);
app.use('/',indexSancionados);
app.use('/',indexParticularesSancionados);
app.use('/', indexRENIRESP);

//CHARTS
app.use('/', querysSanciondos);
app.use('/', queryPartiuclaresSancionados);
app.use('/',queryServidoresIntervienen);


app.listen(process.env.PORT_GLOBAL, () => console.log('Example app listening on port '+process.env.PORT_GLOBAL))
