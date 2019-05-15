import express from 'express';
import 'cross-fetch/polyfill';
import ApolloClient from "apollo-boost";
import {gql} from "apollo-boost";
import {InMemoryCache} from "apollo-cache-inmemory";

var router = express.Router();

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
        proveedor: item.nombre_razon_social ? item.nombre_razon_social : leyenda,
        dependencia: item.institucion_dependencia ? item.institucion_dependencia.nombre : leyenda,
        expediente: item.numero_expediente ? item.numero_expediente : leyenda,
        hechos: item.causa_motivo_hechos ? item.causa_motivo_hechos : leyenda,
        objetoSocial: item.objeto_social ? item.objeto_social : leyenda,
        sentidoResolucion: item.resolucion ? item.resolucion.sentido : leyenda,
        fechaNotificacion: item.fecha_notificacion ? item.fecha_notificacion : leyenda,
        fechaResolucion: item.fecha_de_resolucion ? item.fecha_de_resolucion : leyenda,
        plazo: item.plazo ? item.plazo.fecha_inicial + "-" + item.plazo.fecha_final : leyenda,
        monto: item.multa ? item.multa.monto : leyenda,
        responsableInformacion: item.responsable ? item.responsable.nombres + ' ' + item.responsable.primer_apellido + ' '
            + item.responsable.segundo_apellido : leyenda,
        fechaActualizacion: item.fecha_captura ? item.fecha_captura : leyenda
    };
};

let getTotal = (params) => {
    return new Promise((resolve, reject) => {
        const unsubscribe = client
            .query({
                variables:
                    {
                        "filtros": params,
                        "limit": null,
                        "offset": 0
                    },

                query: gql` 
                   query tot($filtros: FiltrosInput, $limit: Int, $offset : Int) {
                       particulares_sancionados(filtros: $filtros, limit: $limit, offset : $offset){
                            nombre_razon_social
                            institucion_dependencia{
                              nombre
                            }
                            numero_expediente
                           }
                                            }
                             `
            }).then(res => {
                resolve(res.data.particulares_sancionados.length);
            }).catch(err => {
                console.log("Error: ", err);
                return 0;
            });
    });

};

router.post('/getParticularesSancionados', (req, response) => {
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
                       particulares_sancionados(filtros: $filtros, limit: $limit, offset : $offset){
                        nombre_razon_social
                        institucion_dependencia{
                          nombre
                        }
                        numero_expediente
                        #causa_motivo_hechos
                        objeto_social
                        resolucion{
                          sentido
                        }
                        fecha_notificacion
                        plazo{
                          fecha_inicial
                          fecha_final
                        }
                        multa{
                          moneda
                          #monto
                        }
                        responsable{
                          nombres
                          primer_apellido
                          segundo_apellido
                        }   
                        fecha_captura
                      }
                    }
                             `
        }).then(res => {
        if (res && res.data && res.data.particulares_sancionados) {
            let total = 0;
            getTotal(req.body.filtros).then(result => {
                total = result;
                let dataAux = res.data.particulares_sancionados.map(item => {
                    return createData(item);
                });
                return response.status(200).send(
                    {
                        "totalRows": total,
                        "data": dataAux
                    });
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