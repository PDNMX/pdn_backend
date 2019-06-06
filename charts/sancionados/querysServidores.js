var express = require('express');
var router = express.Router();
var cors = require('cors');


const {Client} = require('pg');

const connectionData = {
  user : process.env.USER_POSTGRES,
  host : process.env.HOST_POSTGRES,
  database : process.env.DATABASE_VIZ_S3,
  password : process.env.PASSWORD_POSTGRES,
  port : process.env.PORT_POSTGRES
};


router.get('/viz/servidores/getTemporalidadSanciones', cors(),(req,res)=>{
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

router.get('/viz/servidores/getCausasSanciones', cors(),(req,res)=>{
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

router.get('/viz/servidores/getAnioSancion', cors(),(req,res)=>{
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

router.get('/viz/servidores/getDependenciaMayor', cors(),(req,res)=>{
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

router.get('/viz/servidores/getDependenciaCausa', cors(),(req,res)=>{
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

router.get('/viz/servidores/getCausasAnio', cors(),(req,res)=>{
    const client = new Client(connectionData);
    client.connect ();

    client.query("select date_part('year',fecha_resolucion::date) anio,causa, count(*) as total from rsps group by anio,causa")
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


router.get('/viz/servidores/getSancionesAnualesDependencia', cors(),(req,res)=>{
    const client = new Client(connectionData);
    client.connect ();

    client.query("select anio, dependencia,total " +
        "from( " +
        "select date_part('year',fecha_resolucion::date) anio,dependencia, count(*) as total, ROW_NUMBER() OVER(PARTITION BY date_part('year',fecha_resolucion::date)  ORDER BY count(*) desc) AS r " +
        "from rsps " +
        "group by anio,dependencia " +
        "order by anio, total desc " +
        ") x " +
        "where x.r <=10")
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