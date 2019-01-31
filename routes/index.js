var express = require('express');
var uuidv1 = require('uuid/v1');
var router = express.Router();
var cors = require('cors');
var fs = require('fs');

router.post('/uploadOficio',cors(), (req, res) => {
    let uuidSolcitud = uuidv1();
    let file = req.files.file;
    file.name=uuidSolcitud+'.pdf';
    file.mv(`./solicitudes/${file.name}`, err => {
        if (err) return res.status(500).send({status:'ERROR',message: err});
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        return res.status(200).send({status: 'OK', idDocument:uuidSolcitud, nameDocument:file.name})
    })
});

router.post('/deleteOficio',cors(),(req,res)=>{
    let id = req.body.idDocument;
    fs.exists(`./solicitudes/${id}`, function(exist){
        if(exist){
            fs.unlink(`./solicitudes/${id}`);
            return res.status(200).send({status:'OK',mensaje:'Oficio '+ id + ' eliminado correctamente'})
        }else{
            return res.status(400).send({status:'ERROR',mensaje:'El Oficio '+ id + ' no se encuentra en el repositorio'})
        }
    })
});
module.exports = router;
