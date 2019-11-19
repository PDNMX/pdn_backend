var exports = module.exports = {};
import 'cross-fetch/polyfill';
import ApolloClient, {InMemoryCache} from "apollo-boost";
import {gql} from "apollo-boost";

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
    let leyenda = "No existe dato en la base de datos RSPS";
    counter += 1;
    return {
        id: counter,
        nombre: item.nombres ? item.nombres : '',
        apellidoUno: item.primer_apellido ? item.primer_apellido : '',
        apellidoDos: item.segundo_apellido ? item.segundo_apellido : '',
        institucion: item.institucion_dependencia ? {
            nombre: item.institucion_dependencia.nombre ? item.institucion_dependencia.nombre : leyenda,
            siglas: item.institucion_dependencia.siglas ? item.institucion_dependencia.siglas : leyenda
        } : leyenda,
        autoridad_sancionadora: item.autoridad_sancionadora ? item.autoridad_sancionadora : leyenda,
        expediente: item.expediente ? item.expediente : leyenda,
        tipo_sancion: item.tipo_sancion ? item.tipo_sancion : leyenda,
        causa: item.causa ? item.causa : leyenda,
        fecha_captura: item.fecha_captura ? item.fecha_captura : leyenda,
    //    rfc: item.rfc ? item.rfc : leyenda,
      //  curp: item.curp ? item.curp : leyenda,
        //genero: item.genero ? item.genero : leyenda,
        tipo_falta: item.tipo_falta ? item.tipo_falta : leyenda,
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
            observaciones: (item.inhabilitacion.observaciones && item.inhabilitacion.observaciones.trim()) ? item.inhabilitacion.observaciones : leyenda
        } : leyenda,
        puesto: item.puesto ? item.puesto : leyenda
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
        if (req.body.filtros.nombres) filtros.nombres = "%"+req.body.filtros.nombres+"%";
        if (req.body.filtros.primer_apellido) filtros.primer_apellido = "%"+req.body.filtros.primer_apellido +"%" ;
        if (req.body.filtros.segundo_apellido) filtros.segundo_apellido = "%"+req.body.filtros.segundo_apellido+"%";
        if (req.body.filtros.rfc) filtros.rfc =  "%"+req.body.filtros.rfc+"%";
        if (req.body.filtros.curp) filtros.curp =  "%"+req.body.filtros.curp+"%" ;
        if (req.body.filtros.nombre) filtros.nombre =  "%"+req.body.filtros.nombre+"%";

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
                    clave_api: CLAVE_API,
                    nivel: "Federal"
                })
            }
        }).catch(err => {
            console.log("Error SFP(getPrevioServidoresSancionados):",err);
            resolve({
                sujeto_obligado: SO,
                estatus: false,
                totalRows: 0,
                clave_api: CLAVE_API,
                nivel: "Federal"
            })
        })
    })
};


exports.getServidoresSancionados = function (req) {
    return new Promise((resolve, reject) => {
        let filtros = {};
        if (req.body.filtros.nombres) filtros.nombres = "%"+req.body.filtros.nombres+"%";
        if (req.body.filtros.primer_apellido) filtros.primer_apellido = "%"+req.body.filtros.primer_apellido +"%" ;
        if (req.body.filtros.segundo_apellido) filtros.segundo_apellido = "%"+req.body.filtros.segundo_apellido+"%";
        if (req.body.filtros.rfc) filtros.rfc =  "%"+req.body.filtros.rfc+"%";
        if (req.body.filtros.curp) filtros.curp =  "%"+req.body.filtros.curp+"%" ;
        if (req.body.filtros.nombre) filtros.nombre =  "%"+req.body.filtros.nombre+"%";
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
            console.log("Error SFP(getServidoresSancionados): ",err);
            reject(err)
        })
    })
};

exports.getDependenciasServidoresSancionados = function (req) {
    return new Promise((resolve, reject) => {
        client
            .query({
                query: gql `
                    query busca{
                        results_dependencias (ordenCampo:nombre, ordenSentido:desc){
                            nombre
                        }
                    }
                             `,
            fetchPolicy: 'no-cache',
            }).then(res => {
            if (res && res.data && res.data.results_dependencias) {
                let dataAux = res.data.results_dependencias.map(item => {
                    return item.nombre
                });
                resolve({
                    "data": dataAux
                });
            }
        }).catch((err)=>{
            console.log("Error SFP(getDependenciasServidoresSancionados): ",err)
            resolve({
                "data":[]
            })
        });
    })
};


