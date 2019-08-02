import express from 'express';
import 'cross-fetch/polyfill';
import ApolloClient from "apollo-boost";
import {gql} from "apollo-boost";
import {InMemoryCache} from "apollo-cache-inmemory";

var router = express.Router();
var cors = require('cors');

const client = new ApolloClient({
    uri: process.env.ENDPOINT_SFP_RENIRESP,
    cache: new InMemoryCache({
        addTypename: false
    })
});

let counter = 0;

let createData = (item) => {
    let leyenda = "NO EXISTE DATO EN LA BASE DE DATOS RENIRESP";
    let tipoArea = item.tipo_area.map(item => {
        switch (item) {
            case 'T':
                return 'TÉCNICA';
                break;
            case 'RE' :
                return 'RESPONSABLE DE LA EJECUCIÓN DE LOS TRABAJOS';
                break;
            case 'RC' :
                return 'RESPONSABLE DE LA CONTRATACIÓN';
                break;
            case 'O' :
                return 'OTRA';
                break;
            case 'C' :
                return 'CONTRATANTE';
                break;
            case 'R' :
                return 'REQUIRENTE';
                break;
            default :
                return leyenda;
                break;
        }
    })
    /*
        let tipoArea = item.tipo_area[0] === 1 ? "REQUIRENTE" : "" +
        item.area_contratante === 1 ? "CONTRATANTE" : "" +
        item.area_recnica === 1 ? "TÉCNICA" : "" +
        item.area_responsable === 1 ? "RESPONSABLE" : "" +
        item.area_otra === 1 ? "OTRA" : "";
    */

    let nivel = item.nivel_responsabilidad === 'A' ? "ATENCIÓN" : item.nivel_responsabilidad === 'R' ? "RESOLUCIÓN" : "TRAMITACIÓN";
    counter += 1;
    return {
        id: counter,
        nombre: item.nombres ? item.nombres : '',
        apellidoUno: item.primer_apellido ? item.primer_apellido : '',
        apellidoDos: item.segundo_apellido ? item.segundo_apellido : '',
        institucion: {
            nombre: item.dependencia && item.dependencia.nombre ? item.dependencia.nombre : leyenda,
            siglas: item.dependencia && item.dependencia.siglas ? item.dependencia.siglas : ''
        },
        puesto: {
            nombre: item.puesto && item.puesto.nombre ? item.puesto.nombre : leyenda,
            nivel: item.puesto && item.puesto.nivel ? item.puesto.nivel : leyenda
        },
        tipoArea: tipoArea,
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
        tipo_actos: item.tipo_actos ? item.tipo_actos : leyenda,
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

router.post('/apis/s2/getSPC', cors(), (req, response) => {
    client
        .query({
            variables: {
                "filtros": req.body.filtros,
                "first": req.body.limit,
                "start": req.body.offset
            },
            query: gql`
           query test($filtros: Filtros, $first: Int, $start: Int, $sort: Sort) {
              servidor_publico(filtros: $filtros, first: $first, start: $start, sort: $sort){
                totalCount
                pageInfo {
                  hasNextPage
                }
                results {
                  id
                  fecha_captura
                  ejercicio_fiscal
                  periodo_ejercicio {
                    fecha_inicial
                    fecha_final
                  }
                  id_ramo
                  ramo
                  nombres
                  primer_apellido
                  segundo_apellido
                  genero
                  dependencia {
                    siglas
                    nombre
                    clave
                  }
                  puesto {
                    nombre
                    nivel
                  }
                  tipo_area
                  nivel_responsabilidad
                  tipo_procedimiento
                  tipo_actos
                  superior_inmediato {
                    nombres
                    primer_apellido
                    segundo_apellido
                    
                    puesto {
                      nombre
                      nivel
                    }
                  }
                }
              }
            }

           `
        }).then(res => {
            console.log("Res: ",res);
        if (res && res.data && res.data.servidor_publico && res.data.servidor_publico.results) {
            let dataAux = res.data.servidor_publico.results.map(item => {
                return createData(item);
            });
            return response.status(200).send(
                {
                    "totalRows": res.data.servidor_publico.totalCount,
                    "data": dataAux
                });
        }
    }).catch(err => {
        console.log(err);
        return {
            "codigo": 400,
            "mensaje": "Error al consultar funte de datos"
        }
    })
});
router.get('/apis/getDependenciasRENIRESP', cors(), (req, response) => {
    client
        .query({
            query: gql`
          query{
                  dependencias(sort:{
                    field:nombre
                    direction:ASC
                  }){
                    totalCount
                    results{
                      clave
                      siglas
                      nombre
                    }
                  }
                }
           `
        }).then(res => {
        if (res && res.data && res.data.dependencias && res.data.dependencias.results) {
            let dataAux = res.data.dependencias.results.map(item => {
                return item.nombre;
            });
            return response.status(200).send({
                "data": dataAux
            });
        }


    }).catch(err => {
        console.error(err);
        return {
            "codigo": 400,
            "mensaje": "Error al consultar fuente de datos",
            "data": err
        }
    });
});

module.exports = router;