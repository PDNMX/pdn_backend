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

router.get('/viz/servidoresIntervienen/getAgrupacionEjercicio', cors(),(req,res)=>{
    const client = new Client(connectionData);
    client.connect ();

    client.query("select ejercicio, count(*) total  from reniresp group by ejercicio order by ejercicio;")
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

router.get('/viz/servidoresIntervienen/getAgrupacionPuesto', cors(),(req,res)=>{
    const client = new Client(connectionData);
    client.connect ();

    client.query("select puesto, count(*) total  from reniresp group by puesto order by total desc limit 10;")
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