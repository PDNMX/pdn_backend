import express from 'express';

var router = express.Router();
var cors = require('cors');
var Promise = require("bluebird");

let em = require('./estadoMexico');
let sfp = require('./sfp');

/* router.get('/apis/s2/',cors(),(req,response) => {
    response.status(200).send('holaaaa mundo');
 });  */

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
        console.log(res);
        return response.status(200).send({
            "data":result.data,
            "totalRows":result.totalRows
        });
    });

});

router.get('/apis/s2/dependencias', cors(), (req, response) => {
    sfp.getDependencias(req).then(res=>{
        return response.status(200).send(res);
    }).catch(err =>{
        return response.status(400).send(
            {
                "codigo": 400,
                "mensaje": "Error al consultar la fuente de datos"
            }
        )
    })
}); 
module.exports = router;
