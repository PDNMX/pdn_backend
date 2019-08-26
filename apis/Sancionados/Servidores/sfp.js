var exports = module.exports = {};
import 'cross-fetch/polyfill';
import ApolloClient from "apollo-boost";
import {gql} from "apollo-boost";
import {InMemoryCache} from "apollo-cache-inmemory";

const SO = "Secretaría de la Función Pública";
const CLAVE_API = "sfp";

const client = new ApolloClient({
    uri: process.env.ENDPOINT_SFP_SEVIDORESSANCIONADOS,
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
        nombre: item.nombres ? item.nombres.toUpperCase() : '',
        apellidoUno: item.primer_apellido ? item.primer_apellido.toUpperCase() : '',
        apellidoDos: item.segundo_apellido ? item.segundo_apellido.toUpperCase() : '',
        institucion: item.institucion_dependencia ? {
            nombre: item.institucion_dependencia.nombre ? item.institucion_dependencia.nombre.toUpperCase() : leyenda,
            siglas: item.institucion_dependencia.siglas ? item.institucion_dependencia.siglas.toUpperCase() : leyenda
        } : leyenda,
        autoridad_sancionadora: item.autoridad_sancionadora ? item.autoridad_sancionadora.toUpperCase() : leyenda,
        expediente: item.expediente ? item.expediente : leyenda,
        tipo_sancion: item.tipo_sancion ? item.tipo_sancion.toUpperCase() : leyenda,
        causa: item.causa ? item.causa.toUpperCase() : leyenda,
        fecha_captura: item.fecha_captura ? item.fecha_captura : leyenda,
    //    rfc: item.rfc ? item.rfc : leyenda,
      //  curp: item.curp ? item.curp : leyenda,
        //genero: item.genero ? item.genero : leyenda,
        tipo_falta: item.tipo_falta ? item.tipo_falta.toUpperCase() : leyenda,
        resolucion: item.resolucion ? {
            fecha_notificacion: item.resolucion.fecha_notificacion ? item.resolucion.fecha_notificacion : leyenda
        } : leyenda,
        multa: item.multa ? {
            monto: item.multa.monto ? item.multa.monto : leyenda,
            moneda: item.multa.moneda ? item.multa.moneda : leyenda
        } : leyenda,
        inhabilitacion: item.inhabilitacion ? {
            fecha_inicial: (item.inhabilitacion.fecha_inicial && item.inhabilitacion.fecha_inicial.trim()) ? item.inhabilitacion.fecha_inicial : leyenda,
            fecha_final: (item.inhabilitacion.fecha_final && item.inhabilitacion.fecha_final.trim()) ? item.inhabilitacion.fecha_final : leyenda,
            observaciones: (item.inhabilitacion.observaciones && item.inhabilitacion.observaciones.trim()) ? item.inhabilitacion.observaciones.toUpperCase() : leyenda
        } : leyenda,
        puesto: item.puesto ? item.puesto.toUpperCase() : leyenda
    };
};

let query = gql` 
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
                      total(filtros: $filtros)
                    }
                             `;

exports.getPrevioServidoresSancionados = function (req) {
    return new Promise((resolve, reject) => {
        let filtros = {};
        if (req.body.filtros.nombres) filtros.nombres = "%"+req.body.filtros.nombres.toUpperCase()+"%";
        if (req.body.filtros.primer_apellido) filtros.primer_apellido = "%"+req.body.filtros.primer_apellido.toUpperCase() +"%" ;
        if (req.body.filtros.segundo_apellido) filtros.segundo_apellido = "%"+req.body.filtros.segundo_apellido.toUpperCase()+"%";
        if (req.body.filtros.rfc) filtros.rfc =  "%"+req.body.filtros.rfc.toUpperCase()+"%";
        if (req.body.filtros.curp) filtros.curp =  "%"+req.body.filtros.curp.toUpperCase()+"%" ;
        if (req.body.filtros.nombre) filtros.nombre =  "%"+req.body.filtros.nombre.toUpperCase()+"%";

        console.log("filtros: ",filtros);
        client.query({
            variables: {
                "limit": 1,
                "offset": 0,
                "filtros": filtros
            },
            query: query
        }).then(response => {
            if (response && response.data) {
                resolve({
                    sujeto_obligado: SO,
                    estatus: true,
                    totalRows: response.data.total,
                    clave_api: CLAVE_API
                })
            }
        }).catch(err => {
            resolve({
                sujeto_obligado: SO,
                estatus: false,
                totalRows: 0,
                clave_api: CLAVE_API
            })
        })
    })
};


exports.getServidoresSancionados = function (req) {
    return new Promise((resolve, reject) => {
        let filtros = {};
        if (req.body.filtros.nombres) filtros.nombres = "%"+req.body.filtros.nombres.toUpperCase()+"%";
        if (req.body.filtros.primer_apellido) filtros.primer_apellido = "%"+req.body.filtros.primer_apellido.toUpperCase() +"%" ;
        if (req.body.filtros.segundo_apellido) filtros.segundo_apellido = "%"+req.body.filtros.segundo_apellido.toUpperCase()+"%";
        if (req.body.filtros.rfc) filtros.rfc =  "%"+req.body.filtros.rfc.toUpperCase()+"%";
        if (req.body.filtros.curp) filtros.curp =  "%"+req.body.filtros.curp.toUpperCase()+"%" ;
        if (req.body.filtros.nombre) filtros.nombre =  "%"+req.body.filtros.nombre.toUpperCase()+"%";
        client.query({
            variables: {
                "limit" : req.body && req.body.limit ? req.body.limit : 200,
                "offset" : req.body && req.body.offset ? req.body.offset : 0,
                "filtros": filtros
            },
            query: query
        }).then(response => {
            let dataAux = [];
            if(response.data && response.data.results){
                dataAux = response.data.results.map(item => {
                    return createData(item)
                });
            }
            resolve({data: dataAux, totalRows: response.data.total});
        }).catch(err => {
            reject(err)
        })
    })
};

exports.getDependenciasServidoresSancionados = function (req) {
    return new Promise((resolve, reject) => {
        client
            .query({

                query: gql` 
                    query busca($filtros : FiltrosInput, $limit : Int, $offset : Int){
                      results(filtros : $filtros, limit : $limit, offset : $offset){                  
                        institucion_dependencia{
                          nombre                       
                        }
                 
                    }
                    }
                             `
            }).then(res => {
            if (res && res.data && res.data.results) {
                let dataAux = res.data.results.map(item => {
                    return item.institucion_dependencia.nombre
                });
                let limpio = new Set(dataAux)
                resolve({
                    "data": [...limpio]
                });
            }
        }).catch(()=>{
            resolve({
                "data":[]
            })
        });
    })
};


