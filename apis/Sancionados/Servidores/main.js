import express from 'express';
import 'cross-fetch/polyfill';

var router = express.Router();
var cors = require('cors');
var Promise = require("bluebird");


let em = require('./estadoMexico');
let sfp = require('./sfp');

/*
EN CASO DE PRESENTARSE ERRORES, REGRESA LA INF DEL API CON STATUS = FALSE
* */
router.post('/apis/getPrevioServidoresSancionados', cors(), (req, response) => {
    let nivel = req.body.nivel;
    let getDataPromisses = [];

    switch (nivel) {
        case "federal":
            getDataPromisses.push(sfp.getPrevioServidoresSancionados(req));
            break;
        case "estatal":
            getDataPromisses.push(em.getPrevioServidoresSancionados(req));
            break;
        default :
            getDataPromisses.push(sfp.getPrevioServidoresSancionados(req), em.getPrevioServidoresSancionados(req));
            break;
    }
    Promise.all(getDataPromisses).then(function (res) {
        return response.status(200).send(
            res);
    });
});

/*
ESTE ES EL ÚNICO CON CATCH YA QUE EN ESTE CASO SI PUEDE RETORNAR REJECT(), EN LOS DEMÁS SIEMPRE ES UN
RESOLVE
 */
router.post('/apis/getServidoresSancionados', cors(), (req, response) => {
    let api = req.body.clave_api;
    let getDataPromisses = [];

    switch (api) {
        case "em":
            getDataPromisses.push(em.getServidoresSancionados(req));
            break;
        case "sfp":
            getDataPromisses.push(sfp.getServidoresSancionados(req));
            break;
    }

    Promise.all(getDataPromisses).then(function (res) {
        let result = res[0];
        return response.status(200).send({
            "data": result.data,
            "totalRows": result.totalRows
        });
    }).catch(error=>{
        return response.status(404).send({
            "codigo":404,
            "error" : error
        })
    });

});

/*
EN CASO DE PRESENTARSE ERRORES EN UN PROMISSE SE DEVUELVE UN ARREGLO VACIO PARA EL MISMO
 */
router.post('/apis/getDependenciasServidores', cors(), (req, response) => {
    let nivel = req.body.nivel;
    let getDataPromisses = [];

    switch (nivel) {
        case "federal":
            getDataPromisses.push(sfp.getDependenciasServidoresSancionados(req));
            break;
        case "estatal":
            getDataPromisses.push(em.getDependenciasServidoresSancionados(req));
            break;
        default :
            getDataPromisses.push(em.getDependenciasServidoresSancionados(req),sfp.getDependenciasServidoresSancionados(req) );
            break;
    }

    Promise.all(getDataPromisses).then(
        function (res) {
            let instituciones = [];
        res.forEach(item => {
            if(item.data)
                instituciones = instituciones.concat(item.data);
        })

        instituciones.sort();
        return response.status(200).send({"data": instituciones});
    }
    );


});

module.exports = router;