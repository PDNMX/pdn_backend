const express = require('express');
const uuidv1 = require('uuid/v1');
var cors = require('cors')

var router = express.Router();

var corsOptions={
    origin:false
}

router.post('/uploadOficio',cors(corsOptions), (req, res) => {
    let uuidSolcitud = uuidv1();
    let file = req.files.file;
    file.name=uuidSolcitud+'.pdf';
    file.mv(`./solicitudes/${file.name}`, err => {
        if (err) return res.status(500).send({status:'ERROR',message: err});
        return res.status(200).send({status: 'OK', idDocument:uuidSolcitud, nameDocument:file.name})
    })
});


module.exports = router;
