var express = require('express');
var router = express.Router();
var cors = require('cors');


const {Client} = require('pg');

const connectionData = {
    user: process.env.USER_POSTGRES,
    host: process.env.HOST_POSTGRES,
    database: process.env.DATABASE_VIZ_S3,
    password: process.env.PASSWORD_POSTGRES,
    port: process.env.PORT_POSTGRES
};

router.get('/viz/servidoresIntervienen/getAgrupacionEjercicio', cors(), (req, res) => {
    const client = new Client(connectionData);
    client.connect();

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
            console.log("Error : ", err);
            return res.status(400).send(
                {
                    "status": 400,
                    "mensaje": "Error al consultar BD"
                }
            )
        })
});

router.get('/viz/servidoresIntervienen/getAgrupacionPuesto', cors(), (req, res) => {
    const client = new Client(connectionData);
    client.connect();

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
            console.log("Error : ", err);
            return res.status(400).send(
                {
                    "status": 400,
                    "mensaje": "Error al consultar BD"
                }
            )
        })
});

router.post('/viz/servidoresIntervienen/getAgrupaciones', cors(), (req, res) => {
    const client = new Client(connectionData);
    client.connect();

    let aux = "";
    if (req.body.filtros) {
        req.body.filtros.forEach((item, index) => {
            aux += (index === 0 ? item : (" and " + item))
        });
    }

    let query = "select ejercicio, ramo,institucion, count(*) total  " +
        " from reniresp " +
        (req.body.filtros ? (" where " + aux) : "") +
        " group by ejercicio,ramo,institucion "+
        " order by total desc,ejercicio,ramo,institucion";

    client.query(
        query
    )
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
            console.log("Error : ", err);
            return res.status(400).send(
                {
                    "status": 400,
                    "mensaje": "Error al consultar BD"
                }
            )
        })
});

router.get('/viz/servidoresIntervienen/getEjercicios', cors(), (req, res) => {
    const client = new Client(connectionData);
    client.connect();
    client.query(
        "select ejercicio from reniresp group by ejercicio order by ejercicio "
    )
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
            console.log("Error : ", err);
            return res.status(400).send(
                {
                    "status": 400,
                    "mensaje": "Error al consultar BD"
                }
            )
        })
});


router.post('/viz/servidoresIntervienen/getRamos', cors(), (req, res) => {
    const client = new Client(connectionData);
    let query = "select ramo from reniresp " +
        (req.body.filtros ? (" where " + req.body.filtros) : "") +
        " group by ramo order by ramo ";
    client.connect();
    console.log("query: ",query);
    client.query(
        query
    )
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
            console.log("Error : ", err);
            return res.status(400).send(
                {
                    "status": 400,
                    "mensaje": "Error al consultar BD"
                }
            )
        })
});

router.post('/viz/servidoresIntervienen/getInstituciones', cors(), (req, res) => {
    const client = new Client(connectionData);
    client.connect();

    let aux = "";
    if (req.body.filtros) {
        req.body.filtros.forEach((item, index, array) => {
            aux += (index === 0 ? item : (" and " + item))
        });
    }

    let query = "select institucion from reniresp " +
        (req.body.filtros ? (" where " + aux) : "") +
        " group by institucion order by institucion ";
    client.query(
        query
    )
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
            console.log("Error : ", err);
            return res.status(400).send(
                {
                    "status": 400,
                    "mensaje": "Error al consultar BD"
                }
            )
        })
});


router.post("/viz/servidoresIntervienen/getTop", cors(),(req,res)=>{
   const client = new Client(connectionData);

    let aux = "";
    if (req.body.filtros) {
        req.body.filtros.forEach((item, index) => {
            aux += (index === 0 ? item : (" and " + item))
        });
    }

   let query = "select "+ req.body.top+" as top, count(*) total from reniresp " +
       (req.body.filtros ? (" where " + aux) : "") +
       " group by "+ req.body.top + " order by total desc limit 10"  ;

   client.connect();
   client.query(query)
       .then(response=>{
         let rows = response.rows;
         client.end();
         return res.status(200).send(
             {
                 "status": 200,
                 "data": rows
       })
     })
       .catch(err=>{
         client.end();
         console.log("Error : ", err);
         return res.status(400).send(
             {
                 "status": 400,
                 "mensaje": "Error al consultar BD"
             }
         )
       });
});


module.exports = router;
