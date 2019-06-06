import express from 'express';
import 'cross-fetch/polyfill';
import ApolloClient from "apollo-boost";
import {gql} from "apollo-boost";
import {InMemoryCache} from "apollo-cache-inmemory";

var router = express.Router();
var cors = require('cors');

const client = new ApolloClient({
    uri: "https://dgti-ees-particulares-Sancionados-api-staging.200.34.175.120.nip.io/?token=secreto",
    cache: new InMemoryCache({
        addTypename: false
    })
});

let counter = 0;
let createData = (item) => {
    counter += 1;
    let leyenda = "NO EXISTE DATO EN LA BASE DE DATOS SFP";
    return {
        id: counter,
        fecha_captura: item.fecha_captura ? item.fecha_captura : leyenda,
        numero_expediente: item.numero_expediente ? item.numero_expediente : leyenda,
        nombre_razon_social: item.nombre_razon_social ? item.nombre_razon_social : leyenda,
        rfc: item.rfc ? item.rfc : leyenda,
        telefono: item.telefono ? item.telefono : leyenda,
        domicilio: item.domicilio ? '' : leyenda,
        tipo_sancion: item.tipo_sancion ? item.tipo_sancion : leyenda,
        institucion_dependencia: item.institucion_dependencia ? {
            nombre: item.institucion_dependencia.nombre ? item.institucion_dependencia.nombre : leyenda,
            siglas: item.institucion_dependencia.siglas ? item.institucion_dependencia.siglas : leyenda
        } : leyenda,
        tipo_falta: item.tipo_falta ? item.tipo_falta : leyenda,
        causa_motivo_hechos: item.causa_motivo_hechos ? item.causa_motivo_hechos : leyenda,
        objetoSocial: item.objeto_social ? item.objeto_social : leyenda,
        autoridad_sancionadora: item.autoridad_sancionadora ? item.autoridad_sancionadora : leyenda,
        responsable: item.responsable ? item.responsable.nombres + ' ' + item.responsable.primer_apellido + ' '
            + item.responsable.segundo_apellido : leyenda,
        resolucion: item.resolucion ? {
            sentido: item.resolucion.sentido ? item.resolucion.sentido : leyenda
        } : leyenda,
        fecha_notificacion: item.fecha_notificacion ? item.fecha_notificacion : leyenda,
        multa: item.multa ? {
            monto: item.multa.monto ? item.multa.monto : leyenda,
            moneda: item.multa.moneda ? item.multa.moneda : leyenda
        } : leyenda,
        plazo: item.plazo ? item.plazo.fecha_inicial + " - " + item.plazo.fecha_final : leyenda,
        observaciones: item.observaciones ? item.observaciones : leyenda
    };
};


router.post('/apis/getParticularesSancionados', cors(), (req, response) => {
    client
        .query({
            variables:
                {
                    "filtros": req.body.filtros,
                    "limit": req.body.limit,
                    "offset": req.body.offset
                },

            query: gql` 
                   query busca($filtros: FiltrosInput, $limit: Int, $offset : Int) {
                       results(filtros: $filtros, limit: $limit, offset : $offset){
                        fecha_captura
                        numero_expediente
                        nombre_razon_social
                        rfc
                        telefono
                        domicilio{
                          valor
                        }
                        tipo_sancion
                        institucion_dependencia{
                         nombre
                          siglas
                        }
                        tipo_falta
                        causa_motivo_hechos
                        objeto_social
                        autoridad_sancionadora
                        responsable{
                          nombres
                          primer_apellido
                          segundo_apellido
                        }
                        resolucion{
                          sentido
                        }
                        fecha_notificacion
                        multa{
                          monto
                          moneda
                        }
                        plazo{
                          fecha_inicial
                          fecha_inicial
                        }
                        observaciones
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
                    "totalRows": res.data.total,
                    "data": dataAux
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