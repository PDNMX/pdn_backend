import express from 'express';
import 'cross-fetch/polyfill';

var router = express.Router();
var cors = require('cors');
var Promise = require("bluebird");

let em = require("./estadoMexico.js");
let sfp = require("./sfp");
let pue = require("./puebla.js");

/*
No cuenta con catch pues en caso de algún error se responde con resolve y los datos del api que
no funciona
 */
router.post('/apis/getPrevioParticularesSancionados', cors(), (req, response) => {
    let nivel = req.body.nivel;
    let getDataPromisses = [];

    switch (nivel) {
        case "federal":
            getDataPromisses.push(sfp.getPrevioParticularesSancionados(req));
            break;
        case "estatal":
            //getDataPromisses.push(em.getPrevioParticularesSancionados(req),pue.getPrevioParticularesSancionados(req));
            getDataPromisses.push(em.getPrevioParticularesSancionados(req));
            break;
        default:
            //getDataPromisses.push(sfp.getPrevioParticularesSancionados(req), em.getPrevioParticularesSancionados(req),pue.getPrevioParticularesSancionados(req));
            getDataPromisses.push(sfp.getPrevioParticularesSancionados(req), em.getPrevioParticularesSancionados(req));
            break;
    }

    Promise.all(getDataPromisses).then(function (res) {
        return response.status(200).send(
            res);
    });
});

/*
En caso de error devuelve status 500
 */
router.post('/apis/getParticularesSancionados', cors(), (req, response) => {
    let api = req.body.clave_api;
    let getDataPromisses = [];

    switch (api) {
        case "em":
            getDataPromisses.push(em.getParticularesSancionados(req));
            break;
        case "sfp":
            getDataPromisses.push(sfp.getParticularesSancionados(req));
            break;
        case "pue":
            getDataPromisses.push(pue.getParticularesSancionados(req));
    }

    Promise.all(getDataPromisses).then(function (res) {
        let result = res[0];
        return response.status(200).send(
            {
                "data":result.data,
                "totalRows":result.totalRows
            });
    }).catch(function (err) {
        return response.status(500).send(
            {
                "codigo":500,
                "error": err
            })
    });
});

/*
No devuelve errores, en caso de presentarse uno dentro de las promisses devuelve []
 */
router.post('/apis/getDependenciasParticulares', cors(), (req, response) => {
    let nivel = req.body.nivel;
    let getDataPromisses = [];

    switch (nivel) {
        case "federal":
            getDataPromisses.push(sfp.getDependenciasParticularesSancionados(req));
            break;
        case "estatal":
            //getDataPromisses.push(em.getDependenciasParticularesSancionados(req),pue.getDependenciasParticularesSancionados());
            getDataPromisses.push(em.getDependenciasParticularesSancionados(req));
            break;
        default :
            //getDataPromisses.push(sfp.getDependenciasParticularesSancionados(req),pue.getDependenciasParticularesSancionados() );
            getDataPromisses.push(sfp.getDependenciasParticularesSancionados(req));
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