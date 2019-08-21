var exports = module.exports = {};
import 'cross-fetch/polyfill';
var request = require("request");

let counter = 0;

let createDataEM = (item) =>{
    counter += 1;
    let leyenda = "NO EXISTE DATO EN LA BASE DEL ESTADO DE MÉXICO";
    return {
        id: counter,
        nombre: item.servidor_publico_sancioando && item.servidor_publico_sancioando.nombres ? item.servidor_publico_sancioando.nombres : '',
        apellidoUno: item.servidor_publico_sancioando && item.servidor_publico_sancioando.primer_apellido ? item.servidor_publico_sancioando.primer_apellido : '',
        apellidoDos: item.servidor_publico_sancioando && item.servidor_publico_sancioando.segundo_apellido ? item.servidor_publico_sancioando.segundo_apellido : '',
        institucion: item.institucion_dependencia ? {
            nombre: item.institucion_dependencia.nombre ? item.institucion_dependencia.nombre : leyenda,
            siglas: item.institucion_dependencia.siglas ? item.institucion_dependencia.siglas : leyenda
        } : leyenda,
        autoridad_sancionadora: item.autoridad_sancionadora ? item.autoridad_sancionadora : leyenda,
        expediente: item.expediente ? item.expediente : leyenda,
        tipo_sancion: item.tipo_sancion ? item.tipo_sancion : leyenda,
        causa: item.causa_motivo_hechos ? item.causa_motivo_hechos : leyenda,
        fecha_captura: item.fecha_captura ? item.fecha_captura : leyenda,
        rfc: item.servidor_publico_sancioando && item.servidor_publico_sancioando.rfc ? item.servidor_publico_sancioando.rfc : leyenda,
        curp: item.servidor_publico_sancioando && item.servidor_publico_sancioando.curp ? item.servidor_publico_sancioando.curp : leyenda,
        genero: item.servidor_publico_sancioando && item.servidor_publico_sancioando.genero ? item.servidor_publico_sancioando.genero : leyenda,
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
        puesto: item.servidor_publico_sancioando && item.servidor_publico_sancioando.puesto ? item.servidor_publico_sancioando.puesto : leyenda
    };
};

function getToken() {
    let options = {
        method: 'POST',
        url: process.env.ENDPOINT_EM_TOKEN,
        qs:
            {
                grant_type: 'password',
                username: process.env.EM_USERNAME,
                password: process.env.EM_PASSWORD
            },
        headers:
            {
                Authorization: 'Basic '+process.env.EM_PB64
            }
    };
    return new Promise((resolve, reject) => {
            request(options, function (error, res, body) {
                if (error) reject;
                if (body) {
                    let info = JSON.parse(body);
                    resolve({
                        "token": info.access_token
                    })
                }
            });
        }
    );
};




exports.getPrevioServidoresSancionados =  function (req) {
    return new Promise((resolve, reject) => {
        getToken().then(res => {
            let token = res.token;
            getDataPrevio(token,req).then(resultado => {
                resolve(
                    resultado
                )
            }).catch(error => {
                reject(error)
            });

        }).catch(error => {
            resolve({
                sujeto_obligado: "Estado de México",
                estatus:false,
                totalRows: 0,
                clave_api:"em"
            })
        });
    });
};


function getDataPrevio(token,req) {
    let options = {
        method: 'GET',
        url: process.env.ENDPOINT_EM_PARTICULARESSANCIONADOS,
        qs:
            {
                access_token: token,
                sort: 'asc',
                page: req.body.offset > 0 ? req.body.offset : 1,
                page_size: 1

            }
    };

    if(req.body.filtros.nombres) options.qs.nombres = req.body.filtros.nombre_razon_social
    if(req.body.filtros.primer_apellido) options.qs.apellido1 = req.body.filtros.nombre_razon_social
    if(req.body.filtros.segundo_apellido) options.qs.apellido2 = req.body.filtros.nombre_razon_social
    if(req.body.filtros.rfc) options.qs.rfc = req.body.filtros.rfc
    if(req.body.filtros.curp) options.qs.curp = req.body.filtros.curp

    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (error) reject({
                sujeto_obligado: "Estado de México",
                estatus:false,
                totalRows: 0,
                clave_api:"em"
            });
            if (body) {
                let info = JSON.parse(body)
                resolve({
                    sujeto_obligado: "Estado de México",
                    estatus: true,
                    totalRows: info.pagination.total,
                    clave_api:"em"
                })
            }
        });

    });
};

function getData(token,req) {
    let options = {
        method: 'GET',
        url: process.env.ENDPOINT_EM_SERVIDORESSANCIONADOS,
        qs:
            {
                access_token: token,
                sort: 'asc',
                page: req.body.offset>0? (req.body.offset/req.body.limit) : 1,
                page_size: req.body.limit

            }
    };
    if(req.body.filtros.nombres) options.qs.nombres = req.body.filtros.nombre_razon_social
    if(req.body.filtros.primer_apellido) options.qs.apellido1 = req.body.filtros.nombre_razon_social
    if(req.body.filtros.segundo_apellido) options.qs.apellido2 = req.body.filtros.nombre_razon_social
    if(req.body.filtros.rfc) options.qs.rfc = req.body.filtros.rfc
    if(req.body.filtros.curp) options.qs.curp = req.body.filtros.curp

    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (error) reject;
            if (body) {
                let info = JSON.parse(body);
                resolve({
                    results: info.results,
                    totalRows: info.pagination.total
                })
            }
        });

    });
}

exports.getServidoresSancionados =  function (req) {
    return new Promise((resolve, reject) => {
        getToken().then(res => {
            let token = res.token;
            getData(token,req).then(resultado => {

                let previos = resultado.results;
                let datosMapeados = previos.map(item => {
                    return createDataEM(item);
                });

                resolve(
                    {
                        "data": datosMapeados,
                        "totalRows" : resultado.totalRows
                    })
            }).catch(error => {
                reject(error)
            });

        }).catch(err => {
            return response.status(400).send(
                {
                    "error": err
                })
        });
    });
}
