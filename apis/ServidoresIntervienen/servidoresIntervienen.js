import express from 'express';
import 'cross-fetch/polyfill';
import ApolloClient from "apollo-boost";
import {gql} from "apollo-boost";
import {InMemoryCache} from "apollo-cache-inmemory";

var router = express.Router();
var cors = require('cors');

const client = new ApolloClient({
    uri: process.env.ENDPOINT_SFP_RENIRESP,
    cache: new InMemoryCache({
        addTypename: false
    })
});

router.get('/apis/getDependenciasRENIRESP', cors(), (req, response) => {
    client
        .query({
            variables:null,
            query: gql`
          query{
                  dependencias(sort:{
                    field:nombre
                    direction:ASC
                  }){
                    totalCount
                    results{
                      clave
                      siglas
                      nombre
                    }
                  }
                }
           `
        }).then(res => {
            console.log("Res: ",res);
            if(res && res.data && res.data.dependencias && res.data.dependencias.results){
                let dataAux = res.data.dependencias.results.map(item =>{
                    return item.nombre;
                });
                return response.status(200).send({
                    "data" : dataAux
                });
            }


    }).catch(err=>{
        console.log("eRR: ",err);
        return {
            "codigo" : 400,
            "mensaje" : "Error al consultar fuente de datos",
            "data": err
        }
    });
});

module.exports = router;