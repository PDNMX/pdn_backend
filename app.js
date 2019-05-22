import express from 'express';

const app = express()
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var fileUpload = require('express-fileupload');

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

var indexRouter = require('./routes/index');
var indexSancionados = require('./apis/Sancionados/servidores');
var indexParticularesSancionados = require('./apis/Sancionados/particulares');
var querysSanciondos = require('./charts/sancionados/querys')

app.use('/', indexRouter);
app.use('/',indexSancionados);
app.use('/',indexParticularesSancionados);
app.use('/', querysSanciondos);


app.listen(3100, () => console.log('Example app listening on port 3100!'))
