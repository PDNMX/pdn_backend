var express = require('express');
var router = express.Router();
var cors = require('cors');


const {Client} = require('pg');

const connectionData = {
  user : 'app_user',
  host :'localhost',
  database : 'app_db',
  password : 'P4ndtp9JMQsqGm2C',
  port : 5432
};


router.get('/viz/getTemporalidadSanciones', cors(),(req,res)=>{
    const client = new Client(connectionData);
    client.connect ();

    client.query("select date_part('year',fin::date)-date_part('year',inicio::date) as anios , count(*) as total from rsps where sancion_impuesta='INHABILITACION' group by anios order by anios")
        .then(response => {
            let rows = response.rows;
            client.end();
            return res.status(200).send(
                {
                    "status": 200,
                    "data": rows
                });
        })
        .catch(err => {
            client.end();
            console.log("Error : ",err);
            return res.status(400).send(
                {
                    "status" : 400,
                    "mensaje" : "Error al consultar BD"
                }
            )
        })
});

router.get('/viz/getCausasSanciones', cors(),(req,res)=>{
    const client = new Client(connectionData);
    client.connect ();

    client.query("select causa, count(*) as total from rsps group by causa order by total desc")
        .then(response => {
            let rows = response.rows;
            client.end();
            return res.status(200).send(
                {
                    "status": 200,
                    "data": rows
                });
        })
        .catch(err => {
            client.end();
            console.log("Error : ",err);
            return res.status(400).send(
                {
                    "status" : 400,
                    "mensaje" : "Error al consultar BD"
                }
            )
        })
});

router.get('/viz/getAnioSancion', cors(),(req,res)=>{
    const client = new Client(connectionData);
    client.connect ();

    client.query("select date_part('year',fecha_resolucion::date) anio_resolucion, count(*) from rsps group by anio_resolucion order by anio_resolucion")
        .then(response => {
            let rows = response.rows;
            client.end();
            return res.status(200).send(
                {
                    "status": 200,
                    "data": rows
                });
        })
        .catch(err => {
            client.end();
            console.log("Error : ",err);
            return res.status(400).send(
                {
                    "status" : 400,
                    "mensaje" : "Error al consultar BD"
                }
            )
        })
});

router.get('/viz/getDependenciaMayor', cors(),(req,res)=>{
    const client = new Client(connectionData);
    client.connect ();

    client.query("select dependencia, count(*) as total_sanciones from rsps group by dependencia order by total_sanciones desc limit 15")
        .then(response => {
            let rows = response.rows;
            client.end();
            return res.status(200).send(
                {
                    "status": 200,
                    "data": rows
                });
        })
        .catch(err => {
            client.end();
            console.log("Error : ",err);
            return res.status(400).send(
                {
                    "status" : 400,
                    "mensaje" : "Error al consultar BD"
                }
            )
        })
});

router.get('/viz/getDependenciaCausa', cors(),(req,res)=>{
    const client = new Client(connectionData);
    client.connect ();

    client.query("select dependencia, causa, count(*) as total from rsps group by dependencia,causa order by dependencia")
        .then(response => {
            let rows = response.rows;
            client.end();
            return res.status(200).send(
                {
                    "status": 200,
                    "data": rows
                });
        })
        .catch(err => {
            client.end();
            console.log("Error : ",err);
            return res.status(400).send(
                {
                    "status" : 400,
                    "mensaje" : "Error al consultar BD"
                }
            )
        })
});

module.exports = router;