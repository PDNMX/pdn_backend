import express from 'express';

var router = express.Router();
var cors = require('cors');
var Promise = require("bluebird");

let em = require('./estadoMexico');
let sfp = require('./sfp');

/*
NO DEBE REGRESAR ERRORES, EN CASO DE ERROR DEBE DEVOLVER A INF DEL API QUE ESTA FALLANDO
 */
router.post('/apis/s2/getPrevio',cors(),(req,response) => {
   let nivel = req.body.nivel;
   let getDataPromisses = [];

   switch (nivel) {
       case "federal":
           getDataPromisses.push(sfp.getPrevioServidoresIntervienen(req));
           break;
       case "estatal":
           getDataPromisses.push(em.getPrevioServidoresIntervienen(req));
           break;
       default :
           getDataPromisses.push(sfp.getPrevioServidoresIntervienen(req),em.getPrevioServidoresIntervienen(req));
           break;
   }
    Promise.all(getDataPromisses).then(function (res) {
        return response.status(200).send(
            res);
    });
});


/*
EN CASO DE ERROR DEVUELVE UN 404
 */
router.post('/apis/s2',cors(),(req,response)=>{
    let api = req.body.clave_api;
    let getDataPromisses = [];

    switch (api) {
        case "em":
            getDataPromisses.push(em.getServidoresIntervienen(req));
            break;
        case "sfp":
            getDataPromisses.push(sfp.getServidoresIntervienen(req));
            break;
    }

    Promise.all(getDataPromisses).then(function (res) {
        let result = res[0];
        return response.status(200).send({
            "data":result.data,
            "totalRows":result.totalRows
        });
    }).catch(error=>{
        return response.status(404).send({
            "codigo":404,
            "error" : error
        })
    });

});

/*
NO DEVUELVE ERRORES, EN CASO DE ENCONTRAR ALGÚN ERROR EN EL PROMISE DEVUELVE UN ARREGLO VACIO
 */
router.post('/apis/s2/dependencias', cors(), (req, response) => {
    let nivel = req.body.nivel;
    let getDataPromisses = [];
    switch (nivel) {
        case "federal":
            getDataPromisses.push(sfp.getDependencias(req));
            break;
        case "estatal":
            getDataPromisses.push(em.getDependenciasS2(req));
            break;
        default :
            getDataPromisses.push(em.getDependenciasS2(req),sfp.getDependencias(req) );
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
    });
}); 
module.exports = router;
