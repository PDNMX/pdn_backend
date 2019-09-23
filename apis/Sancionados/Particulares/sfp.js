var exports = module.exports = {};
import 'cross-fetch/polyfill';
import ApolloClient, {InMemoryCache} from "apollo-boost";
import {gql} from "apollo-boost";

const SO = "Secretaría de la Función Pública";
const CLAVE_API = "sfp";

const client = new ApolloClient({
    uri: process.env.ENDPOINT_SFP_PARTICULARESSANCIONADOS,
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
        plazo: (item.plazo && item.plazo.fecha_inicial && item.plazo.fecha_final) ? item.plazo.fecha_inicial + " - " + item.plazo.fecha_final : leyenda,
        observaciones: item.observaciones ? item.observaciones : leyenda
    };
};

let query = gql` 
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
                      total(filtros:$filtros)
                    }
                             `;

exports.getPrevioParticularesSancionados = function (req) {
    return new Promise((resolve, reject) => {
        let filtros = {};

        if (req.body.filtros.nombre_razon_social) filtros.nombre_razon_social = "%"+req.body.filtros.nombre_razon_social+"%";
        if (req.body.filtros.numero_expediente) filtros.numero_expediente = "%"+req.body.filtros.numero_expediente+"%";
        if (req.body.filtros.nombre) filtros.nombre = "%"+req.body.filtros.nombre+"%";

        client
            .query({
                variables:
                    {
                        "filtros": filtros,
                        "limit": 1,
                        "offset": req.body.offset
                    },
                query: query
            }).then(res => {
            if (res && res.data) {
                resolve({
                    sujeto_obligado: SO,
                    estatus: true,
                    totalRows: res.data.total,
                    clave_api: CLAVE_API,
                    nivel: "Federal"
                })
            }
        }).catch(err => {
            console.log("Error: ",err)
            resolve({
                sujeto_obligado: SO,
                estatus: false,
                totalRows: 0,
                clave_api: CLAVE_API,
                nivel: "Federal"
            })
        });
    });
};

exports.getParticularesSancionados = function (req) {
    return new Promise((resolve, reject) => {
        let filtros = {};

        if (req.body.filtros.nombre_razon_social) filtros.nombre_razon_social = "%"+req.body.filtros.nombre_razon_social+"%";
        if (req.body.filtros.numero_expediente) filtros.numero_expediente = "%"+req.body.filtros.numero_expediente+"%";
        if (req.body.filtros.nombre) filtros.nombre = "%"+req.body.filtros.nombre+"%";
        client
            .query({
                variables:
                    {
                        "filtros": filtros,
                        "limit": req.body.limit,
                        "offset": req.body.offset
                    },
                query: query
            }).then(res => {
            if (res && res.data && res.data.results) {
                let dataAux = res.data.results.map(item => {
                    return createData(item);
                });
                resolve({
                    "totalRows": res.data.total,
                    "data": dataAux
                })
            }
        }).catch(err => {
            console.log("Error: ",err)
            reject({
                status:400,
                error: err
            })
        });
    });
};



exports.getDependenciasParticularesSancionados = function (req) {
    return new Promise((resolve, reject) => {
        client
            .query({

                query: gql` query dep{
                      results_dependencias(ordenCampo:nombre, ordenSentido:asc){
                        institucion_dependencia
                        nombre
                        siglas
                        
                      }
                    }

                             `
            }).then(res => {
            if (res && res.data && res.data.results_dependencias) {
                let dataAux = res.data.results_dependencias.map(item => {
                    return item.nombre
                });
                resolve({
                    "data": dataAux
                });
            }
        }).catch(err => {
            resolve({
                "data":[]
            })
        });
    })
};



