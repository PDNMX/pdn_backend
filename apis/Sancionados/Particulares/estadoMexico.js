var exports = module.exports = {};
import 'cross-fetch/polyfill';
var request = require("request");

let counter = 0;

let createDataEM = (item) => {
    counter += 1;
    let leyenda = "NO EXISTE DATO EN LA BASE DEL ESTADO DE MÉXICO";
    return{
        id: counter,
        fecha_captura: item.fecha_captura ? item.fecha_captura : leyenda,
        numero_expediente: item.expediente ? item.expediente : leyenda,
        nombre_razon_social: (item.particular_sancionado && item.particular_sancionado.nombre_razon_social) ? item.particular_sancionado.nombre_razon_social : leyenda,
        rfc: (item.particular_sancionado && item.particular_sancionado.rfc )? item.particular_sancionado.rfc : leyenda,
        telefono:( item.particular_sancionado && item.particular_sancionado.telefono )? item.particular_sancionado.telefono : leyenda,
        domicilio: (item.particular_sancionado && item.particular_sancionado.domicilio) ? '' : leyenda,
        tipo_sancion: item.tipo_sancion ? item.tipo_sancion : leyenda,
        institucion_dependencia: item.institucion_dependencia ? {
            nombre: item.institucion_dependencia.nombre ? item.institucion_dependencia.nombre : leyenda,
            siglas: item.institucion_dependencia.siglas ? item.institucion_dependencia.siglas : leyenda
        } : leyenda,
        tipo_falta: item.tipo_falta ? item.tipo_falta : leyenda,
        causa_motivo_hechos: item.causa_motivo_hechos ? item.causa_motivo_hechos : leyenda,
        objetoSocial: item.particular_sancionado && item.particular_sancionado.objeto_social ? item.particular_sancionado.objeto_social : leyenda,
        autoridad_sancionadora: item.autoridad_sancionadora ? item.autoridad_sancionadora : leyenda,
        responsable: item.responsable_sancion ? item.responsable_sancion.nombres + ' ' + item.responsable_sancion.primer_apellido + ' '
            + item.responsable_sancion.segundo_apellido : leyenda,
        resolucion: item.resolucion ? {
            sentido: item.resolucion.sentido ? item.resolucion.sentido : leyenda
        } : leyenda,
        fecha_notificacion: item.resolucion && item.resolucion.fecha_notificacion ? item.resolucion.fecha_notificacion : leyenda,
        multa: item.multa ? {
            monto: item.multa.monto ? item.multa.monto : leyenda,
            moneda: item.multa.moneda ? item.multa.moneda : leyenda
        } : leyenda,
        plazo: (item.inhabilitacion && item.inhabilitacion.fecha_inicial && item.inhabilitacion.fecha_final) ? item.inhabilitacion.fecha_inicial + " - " + item.inhabilitacion.fecha_final : leyenda,
        observaciones: item.observaciones ? item.observaciones : leyenda
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
                if (error) reject();
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

function getData(token,req) {
    let options = {
        method: 'GET',
        url: process.env.ENDPOINT_EM_PARTICULARESSANCIONADOS,
        qs:
            {
                access_token: token,
                sort: 'asc',
                page: req.body.offset>0? (req.body.offset/req.body.limit) : 1,
                page_size: req.body.limit

            }
    };
    if(req.body.filtros.nombre_razon_social) options.qs.nombres = req.body.filtros.nombre_razon_social
    if(req.body.filtros.nombre) options.qs.institucion = req.body.filtros.nombre
    if(req.body.filtros.expediente) options.qs.expediente = req.body.filtros.expediente

    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (error) reject();
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


exports.getParticularesSancionados =  function (req,response) {
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
                console.log("Error: ",error)
                return response.status(400).send(
                    {
                        "error": error
                    })
            });

        }).catch(err => {
            console.log("Error: ",err)
            return response.status(400).send(
                {
                    "error": err
                })
        });
    });
}

exports.getPrevioParticularesSancionados =  function (req) {
    return new Promise((resolve, reject) => {
        resolve({
            sujeto_obligado: "Estado de México",
            estatus:false,
            totalRows: 0,
            clave_api:"em",
            nivel: "Estatal"
        })
       /* SE COMENTA PORQUE NO SE CUENTAN CON DATOS REALES
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

        */
    });
}

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

    if(req.body.filtros.nombre_razon_social) options.qs.nombres = req.body.filtros.nombre_razon_social
    if(req.body.filtros.nombre) options.qs.institucion = req.body.filtros.nombre
    if(req.body.filtros.expediente) options.qs.expediente = req.body.filtros.expediente


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
}

function getDependencias (token){
    let options = {
        method: 'GET',
        url: process.env.ENDPOINT_EM_PARTICULARESSANCIONADOS_DEPENDENCIAS,
        qs:
            {
                access_token: token
            }
    };


    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (error) reject();
            if (body) {
                let info = JSON.parse(body);
                let dataAux = info.map(item => {
                    return item.nombre
                });
                resolve({
                    instituciones:dataAux,
                })
            }
        });

    });
}
exports.getDependenciasParticularesSancionados = function (req) {
    return new Promise((resolve, reject) => {
        getToken().then(res => {
            let token = res.token;
            getDependencias(token).then(resultado => {
                let limpio = new Set(resultado.instituciones);
                resolve(
                    {
                        "data":  [...limpio],
                    })
            }).catch(error => {
                resolve({
                    "data":[]
                })
            });

        }).catch(err => {
            resolve({
                data:[]
            })
        });
    });
}