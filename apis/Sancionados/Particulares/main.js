import express from 'express';
import 'cross-fetch/polyfill';

var router = express.Router();
var cors = require('cors');
var Promise = require("bluebird");

let em = require("./estadoMexico.js");
let sfp = require("./sfp");


router.post('/apis/getPrevioParticularesSancionados', cors(), (req, response) => {
    let nivel = req.body.nivel;
    let getDataPromisses = [];

    switch (nivel) {
        case "federal":
            getDataPromisses.push(sfp.getPrevioParticularesSancionados(req));
            break;
        case "estatal":
            getDataPromisses.push(em.getPrevioParticularesSancionados(req));
            break;
        default:
            getDataPromisses.push(sfp.getPrevioParticularesSancionados(req), em.getPrevioParticularesSancionados(req));
            break;
    }

    Promise.all(getDataPromisses).then(function (res) {
        return response.status(200).send(
            res);
    });
});


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
    }

    Promise.all(getDataPromisses).then(function (res) {
        let result = res[0];
        return response.status(200).send(
            {
                "data":result.data,
                "totalRows":result.totalRows
            });
    });
});

router.post('/apis/getDependenciasParticulares', cors(), (req, response) => {
    sfp.getDependenciasParticularesSancionados(req).then(res=>{
        return response.status(200).send(res);
    }).catch(err=>{
        return response.status(400).send(
            {
                "codigo": 400,
                "mensaje": "Error al consultar funte de datos"
            }
        )
    })
});


module.exports = router;