var exports = module.exports = {};
import 'cross-fetch/polyfill';
var request = require("request");
let fnct = require('../Utils/functions')

function getToken() {
    let options = {
        method: 'POST',
        url: process.env.ENDPOINT_PUE_SS_TOKEN,
        contentType: 'x-www-form-urlencoded',
        form:
            {
                grant_type: 'password',
                username: process.env.PUE_USERNAME,
                password: process.env.PUE_PASSWORD,
                client_id: process.env.PUE_CLIENTID_SPIC,
                client_secret: process.env.PUE_CLIENTSECRET_SPIC
            }
    };
    return new Promise((resolve, reject) => {
            request(options, function (error, res, body) {

                if (error){
                    console.log("Error PUE(getToken):",error);
                    reject(error)
                };
                if (body) {
                    if (res.statusCode !== 200) {
                        console.log("Error token PUE: statusCode!= 200 ")
                        reject(error);
                    }
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
        method: 'POST',
        url: process.env.ENDPOINT_PUE_SPIC,
        json: true,
        qs:
            {
                access_token: token
            },
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: {
            page: 1,
            pageSize: 1,
            query: fnct.getBodySPIC(req.body.filtros)
        }
    };

    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (error) {
                console.log("Error PUE(getDataPrevio): ",error)
                reject(error)
            };
            if (body) {
                let code = res.statusCode;
                if (code !== 200) {
                    console.log("Error PUE(getDataPrevio): statusCode != 200 ")
                    reject()
                }
                resolve({
                    sujeto_obligado: "Puebla",
                    estatus: true,
                    totalRows: body.pagination.totalRows,
                    clave_api:"pue",
                    nivel: "Estatal"
                })
            }
        });

    });
};

function getData(token,req) {
    let options = {
        method: 'POST',
        url: process.env.ENDPOINT_PUE_SPIC,
        json: true,
        qs:
            {
                access_token: token
            },
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: {
            page: req.body.offset > 0 ? ((req.body.offset / req.body.limit) + 1) : 1,
            pageSize: req.body.limit,
            query: fnct.getBodySPIC(req.body.filtros)
        }
    };

    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (error) {
                console.log("Error PUE(getData): ",error)
                reject(error)
            };
            if (body) {
                if (res.statusCode !== 200) {
                    console.log("Error PUE(getData): statusCode!= 200");
                    reject();
                }
                resolve({
                    results: body.results,
                    totalRows: body.pagination.totalRows
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
                resolve({
                    sujeto_obligado: "Puebla",
                    estatus:false,
                    totalRows: 0,
                    clave_api:"pue"
                })
            });

        }).catch(error => {
            resolve({
                sujeto_obligado: "Puebla",
                estatus:false,
                totalRows: 0,
                clave_api:"pue"
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
                    return fnct.createDataSIPC(item,'Puebla');
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
            reject(err)
        });
    });
}


function getDependencias (token){
    let options = {
        method: 'GET',
        url: process.env.ENDPOINT_PUE_SPIC_DEPENDENCIAS,
        qs:
            {
                access_token: token
            },
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (error) {
                console.log("Error PUE(getDependencias): ",error);
                reject(error)
            };
            if (body) {
                if (res.statusCode !== 200) {
                    console.log("Error token PUE(getDependencias): statusCode!= 200 ")
                    reject();
                }
                let dataAux = body.dependencias.map(item => {
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
                resolve(
                    {
                        "data":  resultado.instituciones,
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
