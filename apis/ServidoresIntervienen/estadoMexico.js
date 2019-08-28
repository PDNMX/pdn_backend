var exports = module.exports = {};
import 'cross-fetch/polyfill';
var request = require("request");

let counter = 0;

let createDataEM = (item) => {
    let leyenda = "NO EXISTE DATO EN LA BASE DEL ESTADO DE MÉXICO";
    let tipoArea = item.tipo_area.map(item => {
        switch (item) {
            case 'T':
                return 'TÉCNICA';
            case 'RE' :
                return 'RESPONSABLE DE LA EJECUCIÓN DE LOS TRABAJOS';
            case 'RC' :
                return 'RESPONSABLE DE LA CONTRATACIÓN';
            case 'O' :
                return 'OTRA';
            case 'C' :
                return 'CONTRATANTE';
            case 'R' :
                return 'REQUIRENTE';
            default :
                return leyenda;
        }
    });
    let tipo_procedimiento = item.tipo_procedimiento.map(item => {
        switch (item) {
            case '1':
                return 'CONTRATACIONES PÚBLICAS';
            case '2' :
                return 'CONCESIONES, LICENCIAS, PERMISOS, AUTORIZACIONES Y PRÓRROGAS';
            case '3' :
                return 'ASIGNACIÓN Y EMISIÓN DE DICTÁMENES DE AVALÚOS NACIONALES';
            case '4' :
                return 'OTRA';
            default :
                return leyenda;
        }
    }) 
    let nivel = item.nivel_responsabilidad === 'A' ? "ATENCIÓN" : item.nivel_responsabilidad === 'R' ? "RESOLUCIÓN" : "TRAMITACIÓN";
    counter += 1;

    return {
        id: item.id,
        nombre: item.nombres ? item.nombres : '',
        apellidoUno: item.primer_apellido ? item.primer_apellido : '',
        apellidoDos: item.segundo_apellido ? item.segundo_apellido : '',
        servidor: (item.nombres ? item.nombres + ' ' : '') + (item.primer_apellido ? item.primer_apellido + ' ' : '') + (item.segundo_apellido ? item.segundo_apellido : ''),
        institucion: {
            nombre: item.institucion_dependencia && item.institucion_dependencia.nombre ? item.institucion_dependencia.nombre : leyenda,
            siglas: item.institucion_dependencia && item.institucion_dependencia.siglas ? item.institucion_dependencia.siglas : ''
        },
        puesto: {
            nombre: item.puesto && item.puesto.nombre ? item.puesto.nombre : leyenda,
            nivel: item.puesto && item.puesto.nivel ? item.puesto.nivel : leyenda
        },
        tipoArea: tipoArea.length && tipoArea.length > 0 ? tipoArea : leyenda,
        contrataciones: item.tipo_procedimiento === 1 ? nivel : "NO APLICA",
        concesionesLicencias: item.tipo_procedimiento === 2 ? nivel : "NO APLICA",
        enajenacion: item.tipo_procedimiento === 3 ? nivel : "NO APLICA",
        dictamenes: item.tipo_procedimiento === 4 ? nivel : "NO APLICA",
        fecha_captura: item.fecha_captura ? item.fecha_captura : leyenda,
        ejercicio_fiscal: item.ejercicio_fiscal ? item.ejercicio_fiscal : leyenda,
        periodo_ejercicio: {
            fecha_inicial: item.periodo_ejercicio && item.periodo_ejercicio.fecha_inicial ? item.periodo_ejercicio.fecha_inicial : leyenda,
            fecha_final: item.periodo_ejercicio && item.periodo_ejercicio.fecha_final ? item.periodo_ejercicio.fecha_final : leyenda
        },
        ramo: {
            id_ramo: item.id_ramo ? item.id_ramo : leyenda,
            ramo: item.ramo ? item.ramo : leyenda
        },
        nivel_responsabilidad: item.nivel_responsabilidad ? item.nivel_responsabilidad : leyenda,
        tipo_actos: tipo_procedimiento.length && tipo_procedimiento.length > 0 ? tipo_procedimiento : leyenda,
        superior_inmediato: {
            nombre: item.superior_inmediato && item.superior_inmediato.nombres ? item.superior_inmediato.nombres : leyenda,
            primer_apellido: item.superior_inmediato && item.superior_inmediato.primer_apellido ? item.superior_inmediato.primer_apellido : leyenda,
            segundo_apellido: item.superior_inmediato && item.superior_inmediato.segundo_apellido ? item.superior_inmediato.segundo_apellido : leyenda,
            puesto: {
                nombre: item.superior_inmediato.puesto && item.superior_inmediato.puesto.nombre ? item.superior_inmediato.puesto.nombre : leyenda,
                nivel: item.superior_inmediato.puesto && item.superior_inmediato.puesto.nivel ? item.superior_inmediato.puesto.nivel : leyenda
            } 
        }
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
                Authorization: 'Basic '+ process.env.EM_PB64
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

function getDataPrevio(token,req) {
    let options = {
        method: 'GET',
        url: process.env.ENDPOINT_EM_SERVIDORESINTERVIENEN,
        qs:
            {
                access_token: token,
                sort: 'asc',
                page: req.body.offset > 0 ? req.body.offset : 1,
                page_size: 1

            }
    };

    if(req.body.filtros.nombres) options.qs.nombres = req.body.filtros.nombres
    if(req.body.filtros.primer_apellido) options.qs.apellido1 = req.body.filtros.primer_apellido
    if(req.body.filtros.segundo_apellido) options.qs.apellido2 = req.body.filtros.segundo_apellido
    if(req.body.filtros.institucion) options.qs.institucion = req.body.filtros.institucion
    if(req.body.filtros.procedimiento) {
        switch (req.body.filtros.procedimiento) {
            case 'CONTRATACIONES':
                options.qs.tipo_procedimiento = 1;
                break;
            case 'CONCESIONES' :
                options.qs.tipo_procedimiento = 2;
                break;
            case 'ENAJENACIONES' :
                options.qs.tipo_procedimiento = 3;
                break;
            case 'DICTAMENES' :
                options.qs.tipo_procedimiento = 4;
                break;
            default :
                options.qs.tipo_procedimiento = '';
        }
    }

    /* console.log(options); */
    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (error) reject({
                sujeto_obligado: "Estado de México",
                estatus:false,
                totalRows: 0,
                clave_api:"em",
                nivel: "Estatal"
            });
            if (body) {
                let info = JSON.parse(body)
                resolve({
                    sujeto_obligado: "Estado de México",
                    estatus: true,
                    totalRows: info.pagination.total,
                    clave_api:"em",
                    nivel: "Estatal"
                })
            }
        });

    });
};

function getData(token,req) {
    let options = {
        method: 'GET',
        url: process.env.ENDPOINT_EM_SERVIDORESINTERVIENEN,
        qs:
            {
                access_token: token,
                sort: 'asc',
                page: req.body.offset>0? (req.body.offset/req.body.limit) : 1,
                page_size: req.body.limit,

            }
    };
    if(req.body.filtros.nombres) options.qs.nombres = req.body.filtros.nombres
    if(req.body.filtros.primer_apellido) options.qs.apellido1 = req.body.filtros.primer_apellido
    if(req.body.filtros.segundo_apellido) options.qs.apellido2 = req.body.filtros.segundo_apellido
    if(req.body.filtros.institucion) options.qs.institucion = req.body.filtros.institucion
    if(req.body.filtros.procedimiento) {
        switch (req.body.filtros.procedimiento) {
            case 'CONTRATACIONES':
                options.qs.tipo_procedimiento = 1;
                break;
            case 'CONCESIONES' :
                options.qs.tipo_procedimiento = 2;
                break;
            case 'ENAJENACIONES' :
                options.qs.tipo_procedimiento = 3;
                break;
            case 'DICTAMENES' :
                options.qs.tipo_procedimiento = 4;
                break;
            default :
                options.qs.tipo_procedimiento = '';
        }
    }
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

exports.getPrevioServidoresIntervienen =  function (req) {
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

exports.getServidoresIntervienen =  function (req) {
    return new Promise((resolve, reject) => {
        getToken().then(res => {
            let token = res.token;
            getData(token,req).then(resultado => {

                let previos = resultado.results;
                let datosMapeados = previos.map(item => {
                    return createDataEM(item);
                    //return item;
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
            console.log(err)
        });
    });
}


function getDependencias (token){
    let options = {
        method: 'GET',
        url: process.env.ENDPOINT_EM_S2_DEPENDENCIAS,
        qs:
            {
                access_token: token
            }
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (error) reject;
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
exports.getDependenciasS2 = function (req) {
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
