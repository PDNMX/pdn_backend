import express from 'express';
import 'cross-fetch/polyfill';
import ApolloClient from "apollo-boost";
import {gql} from "apollo-boost";
import {InMemoryCache} from "apollo-cache-inmemory";

var router = express.Router();
var cors = require('cors');

const client = new ApolloClient({
    uri: "https://dgti-ees-servidores-publicos-Sancionados-api-master.200.34.175.120.nip.io/?token=secreto",
    cache: new InMemoryCache({
        addTypename: false
    })
});

let counter = 0;
let createData = (item) => {
    let leyenda = "NO EXISTE DATO EN LA BASE DE DATOS RSPS";
    counter += 1;
    return {
        id: counter,
        nombre: item.nombres ? item.nombres : leyenda,
        apellidoUno: item.primer_apellido ? item.primer_apellido : leyenda,
        apellidoDos: item.segundo_apellido ? item.segundo_apellido : leyenda,
        institucion: item.institucion_dependencia ? {
            nombre: item.institucion_dependencia.nombre ? item.institucion_dependencia.nombre : leyenda,
            siglas : item.institucion_dependencia.siglas ? item.institucion_dependencia.siglas : leyenda
        } : leyenda,
        autoridad_sancionadora: item.autoridad_sancionadora ? item.autoridad_sancionadora : leyenda,
        expediente: item.expediente ? item.expediente : leyenda,
        tipo_sancion: item.tipo_sancion ? item.tipo_sancion : leyenda,
        causa: item.causa ? item.causa : leyenda,
        fecha_captura: item.fecha_captura? item.fecha_captura : leyenda,
        rfc : item.rfc ? item.rfc : leyenda,
        curp : item.curp ? item.curp : leyenda,
        genero : item.genero ? item.genero : leyenda,
        tipo_falta : item.tipo_falta ? item.tipo_falta : leyenda,
        resolucion : item.resolucion?  {
            fecha_notificacion : item.resolucion.fecha_notificacion ? item.resolucion.fecha_notificacion : leyenda
        } : leyenda,
        multa : item.multa? {
            monto : item.multa.monto ? item.multa.monto : leyenda,
            moneda : item.multa.moneda ? item.multa.moneda : leyenda
        } : leyenda,
        inhabilitacion : item.inhabilitacion ? {
            fecha_inicial : item.inhabilitacion.fecha_inicial ? item.inhabilitacion.fecha_inicial : leyenda,
            fecha_final : item.inhabilitacion.fecha_final ? item.inhabilitacion.fecha_final : leyenda,
            observaciones : item.inhabilitacion.observaciones ? item.inhabilitacion.observaciones : leyenda
        } : leyenda,
        puesto : item.puesto ? item.puesto : leyenda
    };
};



router.post('/apis/getServidoresSancionados',cors(), (req, response) => {
    client
        .query({
            variables:
                {
                    "filtros": req.body.filtros,
                    "limit": req.body.limit,
                    "offset": req.body.offset
                },

            query: gql` 
                    query busca($filtros : FiltrosInput, $limit : Int, $offset : Int){
                      results(filtros : $filtros, limit : $limit, offset : $offset){
                        nombres
                        primer_apellido
                        segundo_apellido
                        institucion_dependencia{
                          nombre
                          siglas
                        }
                        autoridad_sancionadora
                        expediente
                        resolucion{
                          fecha_notificacion
                        }
                        tipo_sancion
                        inhabilitacion{
                          fecha_inicial
                          fecha_final
                          observaciones
                        }
                        multa{
                          monto
                          moneda
                        }
                        causa
                        puesto
                      }
                      total
                    }
                             `
        }).then(res => {
        if (res && res.data && res.data.results) {
            let dataAux = res.data.results.map(item => {
                return createData(item);
            });
            return response.status(200).send(
                {
                    "data": dataAux,
                    "total" : res.data.total
                });
        }
    }).catch(err => {
        console.log(err);
        return {
            "codigo": 400,
            "mensaje": "Error al consultar funte de datos"
        }
    });
});
module.exports = router;