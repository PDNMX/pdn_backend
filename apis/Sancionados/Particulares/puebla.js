var exports = module.exports = {};
import 'cross-fetch/polyfill';
var request = require("request");
let fnct = require('../../Utils/functions')


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
                client_id: process.env.PUE_CLIENTID_PS,
                client_secret: process.env.PUE_CLIENTSECRET_PS
            }
    };
    return new Promise((resolve, reject) => {
            request(options, function (error, res, body) {
                if (error) {
                    console.log("Error token PUE: ", error)
                    reject(error);
                }
                if (body) {
                    if (res.statusCode !== 200) {
                        console.log("Error token PUE: statusCode!= 200, status =  ", res.statusCode)
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

function getData(token,req) {
    let options = {
        method: 'POST',
        url: process.env.ENDPOINT_PUE_PARTICULARESSANCIONADOS,
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
            query: fnct.getBodyPS(req.body.filtros)

        }
    };

    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (error) reject();
            if (body) {
                resolve({
                    results: body.results,
                    totalRows: body.pagination.totalRows
                })
            }
        });

    });
}

function getDataPrevio(token,req) {
    let options = {
        method: 'POST',
        url: process.env.ENDPOINT_PUE_PARTICULARESSANCIONADOS,
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
            query: fnct.getBodyPS(req.body.filtros)
        }
    };


    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (error) reject({
                sujeto_obligado: "Puebla",
                estatus:false,
                totalRows: 0,
                clave_api: "pue"
            });
            if (body) {
                resolve({
                    sujeto_obligado: "Puebla",
                    estatus: true,
                    totalRows: body.pagination.totalRows,
                    clave_api: "pue",
                    nivel: "Estatal"
                })
            }
        });

    });
}

function getDependencias (token){
    let options = {
        method: 'GET',
        url: process.env.ENDPOINT_PUE_PARTICULARESSANCIONADOS_DEPENDENCIAS,
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
            if (error) reject();
            if (body) {
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

exports.getParticularesSancionados =  function (req,response) {
    return new Promise((resolve, reject) => {
        getToken().then(res => {
            let token = res.token;
            getData(token,req).then(resultado => {
                let datosMapeados = resultado.results.map(item => {
                    return fnct.createDataParticularesSancionados(item);
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
                 sujeto_obligado: "Puebla",
                 estatus:false,
                 totalRows: 0,
                 clave_api:"pue"
             })
         });
    });
}

exports.getDependenciasParticularesSancionados = function (req) {
    return new Promise((resolve, reject) => {
        getToken().then(res => {
            let token = res.token;
            getDependencias(token).then(resultado => {
                resolve(
                    {
                        "data": resultado.instituciones,
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