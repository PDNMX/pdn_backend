import express from 'express';
import 'cross-fetch/polyfill';
import {gql} from "apollo-boost";

var router = express.Router();
var cors = require('cors');
var Promise = require("bluebird");


let em = require('./estadoMexico');
let sfp = require('./sfp');

router.post('/apis/getPrevioServidoresSancionados',cors(),(req,response) => {
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
           getDataPromisses.push(sfp.getPrevioServidoresSancionados(req),em.getPrevioServidoresSancionados(req));
           break;
   }
    Promise.all(getDataPromisses).then(function (res) {
        return response.status(200).send(
            res);
    });
});


router.post('/apis/getServidoresSancionados',cors(),(req,response)=>{
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
            "data":result.data,
            "totalRows":result.totalRows
        });
    });

});

router.get('/apis/getDependenciasServidores', cors(), (req, response) => {
    sfp.getDependenciasServidoresSancionados(req).then(res=>{
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