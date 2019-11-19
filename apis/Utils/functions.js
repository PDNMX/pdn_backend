/* MAPEO DATOS SERVIDORES INTERVIENEN */
exports.createDataSIPC = (item, sujetoObligado) => {
    let leyenda = "No existe dato en la base de datos " + sujetoObligado;

    let tipoArea = (item.tipoArea && item.tipoArea.length > 0) ? item.tipoArea.map(item => {
        switch (item.clave) {
            case 'T':
                return 'Técnica';
            case 'RE' :
                return 'Responsable de la ejecución de los trabajos';
            case 'RC' :
                return 'Responsable de la contratación';
            case 'C' :
                return 'Contratante';
            case 'R' :
                return 'Requirente';
            default :
                return item.valor ? item.valor : 'Otra';
        }
    }) : leyenda;

    let tipo_procedimiento = (item.tipoProcedimiento && item.tipoProcedimiento.length > 0) ? item.tipoProcedimiento.map(item => {
        switch (item) {
            case 1:
                return 'Contrataciones públicas';
            case 2 :
                return 'Concesiones, licencias, permisos, autorizaciones y prórrogas';
            case 3:
                return 'Enajenación de bienes muebles';
            case 4 :
                return 'Asignación y emisión de dictámenes de avalúos nacionales';
        }
    }) : [leyenda];

    let nivel = (item.nivelResponsabilidad && item.nivelResponsabilidad > 0) ? item.nivelResponsabilidad.map(item => {
        switch (item) {
            case 'A':
                return 'Atención';
            case 'T':
                return 'Tramitación';
            case 'R':
                return 'Resolución';
        }
    }) : [leyenda];
/*
    let mapeoNuevo = {
        id: item.id ? item.id : leyenda,
        fechaCaptura: item.fechaCaptura && item.fechaCaptura.trim() ? item.fechaCaptura : leyenda,
        ejercicioFiscal: item.ejercicioFiscal ? item.ejercicioFiscal : leyenda,
        periodoEjercicio: {
            fechaInicial: item.periodoEjercicio && item.periodoEjercicio.fechaInicial && item.periodoEjercicio.fechaInicial.trim() ? item.periodoEjercicio.fechaInicial : leyenda,
            fechaFinal: item.periodoEjercicio && item.periodoEjercicio.fechaFinal && item.periodoEjercicio.fechaFinal.trim() ? item.periodoEjercicio.fechaFinal : leyenda
        },
        ramo: {
            clave: item.ramo && item.ramo.clave ? item.ramo.clave : leyenda,
            valor: item.ramo && item.ramo.valor ? item.ramo.valor : leyenda
        },
        nombres: item.nombres ? item.nombres : '',
        primerApellido: item.primerApellido ? item.primerApellido : '',
        segundoApellido: item.segundoApellido ? item.segundoApellido : '',
        servidor: (item.nombres ? item.nombres + ' ' : '') + (item.primerApellido ? item.primerApellido + ' ' : '') + (item.segundoApellido ? item.segundoApellido : ''),
        institucionDependencia: {
            nombre: item.institucionDependencia && item.institucionDependencia.nombre ? item.institucionDependencia.nombre : leyenda,
            siglas: item.institucionDependencia && item.institucionDependencia.siglas ? '(' + item.institucionDependencia.siglas + ')' : ''
        },
        puesto: {
            nombre: item.puesto && item.puesto.nombre ? item.puesto.nombre : leyenda,
            nivel: item.puesto && item.puesto.nivel ? item.puesto.nivel : leyenda
        },
        tipoArea: tipoArea,
         contrataciones: item.tipo_procedimiento === 1 ? nivel : "No aplica",
         concesionesLicencias: item.tipo_procedimiento === 2 ? nivel : "No aplica",
         enajenacion: item.tipo_procedimiento === 3 ? nivel : "No aplica",
         dictamenes: item.tipo_procedimiento === 4 ? nivel : "No aplica",

        nivelResponsabilidad: nivel,
        tipoProcedimiento: tipo_procedimiento,
        superiorInmediato: {
            nombre: item.superiorInmediato && item.superiorInmediato.nombres ? item.superiorInmediato.nombres : leyenda,
            primer_apellido: item.superiorInmediato && item.superiorInmediato.primerApellido ? item.superiorInmediato.primerApellido : leyenda,
            segundo_apellido: item.superiorInmediato && item.superiorInmediato.segundoApellido ? item.superiorInmediato.segundoApellido : '',
            puesto: {
                nombre: item.superiorInmediato && item.superiorInmediato.puesto && item.superiorInmediato.puesto.nombre ? item.superiorInmediato.puesto.nombre : leyenda,
                nivel: item.superiorInmediato && item.superiorInmediato.puesto && item.superiorInmediato.puesto.nivel ? item.superiorInmediato.puesto.nivel : leyenda
            }
        }
    };
*/

    let mapeoAnterior = {
        id: item.id,
        nombre: item.nombres ? item.nombres : '',
        apellidoUno: item.primerApellido ? item.primerApellido : '',
        apellidoDos: item.segundoApellido ? item.segundoApellido : '',
        servidor: (item.nombres ? item.nombres + ' ' : '') + (item.primerApellido ? item.primerApellido + ' ' : '') + (item.segundoApellido ? item.segundoApellido : ''),
        institucion: {
            nombre: item.institucionDependencia && item.institucionDependencia.nombre ? item.institucionDependencia.nombre : leyenda,
            siglas: item.institucionDependencia && item.institucionDependencia.siglas ? item.institucionDependencia.siglas : ''
        },
        puesto: {
            nombre: item.puesto && item.puesto.nombre ? item.puesto.nombre : leyenda,
            nivel: item.puesto && item.puesto.nivel ? item.puesto.nivel : leyenda
        },
        tipoArea: tipoArea.length > 0 ? tipoArea : leyenda,
        contrataciones: item.tipoProcedimiento.includes(1) ? nivel : "No aplica",
        concesionesLicencias: item.tipoProcedimiento.includes(2) ? nivel : "No aplica",
        enajenacion: item.tipoProcedimiento.includes(3) ? nivel : "No aplica",
        dictamenes: item.tipoProcedimiento.includes(4) ? nivel : "No aplica",
        fecha_captura: item.fechaCaptura ? item.fechaCaptura : leyenda,
        ejercicio_fiscal: item.ejercicioFiscal ? item.ejercicioFiscal : leyenda,
        periodo_ejercicio: {
            fecha_inicial: item.periodoEjercicio && item.periodoEjercicio.fechaInicial ? item.periodoEjercicio.fechaInicial : leyenda,
            fecha_final: item.periodoEjercicio && item.periodoEjercicio.fechaFinal ? item.periodoEjercicio.fechaFinal : leyenda
        },
        ramo: {
            id_ramo: item.clave ? item.clave : leyenda,
            ramo: item.valor ? item.valor : leyenda
        },
        nivel_responsabilidad: item.nivelResponsabilidad ? item.nivelResponsabilidad : leyenda,
        tipo_actos: tipo_procedimiento.length && tipo_procedimiento.length > 0 ? tipo_procedimiento : leyenda,
        superior_inmediato: {
            nombre: item.superiorInmediato && item.superiorInmediato.nombres ? item.superiorInmediato.nombres : leyenda,
            primer_apellido: item.superiorInmediato && item.superiorInmediato.primerApellido ? item.superiorInmediato.primerApellido : leyenda,
            segundo_apellido: item.superiorInmediato && item.superiorInmediato.segundoApellido ? item.superiorInmediato.segundoApellido : leyenda,
            puesto: {
                nombre: item.superiorInmediato.puesto && item.superiorInmediato.puesto.nombre ? item.superiorInmediato.puesto.nombre : leyenda,
                nivel: item.superiorInmediato.puesto && item.superiorInmediato.puesto.nivel ? item.superiorInmediato.puesto.nivel : leyenda
            }
        }
    };
    return mapeoAnterior;
}
/* MAPEO DATOS SERVIDORES SANCIONADOS */
exports.createDataServidoresSanciondos = (item, sujetoObligado) => {
    let leyenda = "No existe dato en la base " + sujetoObligado;
    let tipoSancion = (item.tipoSancion && item.tipoSancion.length > 0) ? item.tipoSancion.map(item => {
        switch (item.clave) {
            case 'I' :
                return 'Inhabilitado';
            case 'M' :
                return 'Multado';
            case 'S' :
                return 'Suspensión del empleo, cargo o comisión';
            case 'D' :
                return 'Destitución del empleo, cargo o comisión';
        }
    }) : [leyenda];

    let tipoFalta = leyenda;
    if (item.tipoFalta && item.tipoFalta.clave) {
        switch (item.tipoFalta.clave) {
            case 'NAD' :
                tipoFalta = 'Negligencia administrativa';
                break;
            case 'VPC' :
                tipoFalta = 'Violación procedimientos de contratación';
                break;
            case 'VLNP' :
                tipoFalta = 'Violación leyes y normatividad presupuestal';
                break;
            case 'AUT' :
                tipoFalta = 'Abuso de autoridad';
                break;
            case 'CEX' :
                tipoFalta = 'Cohecho o extorsión';
                break;
            case 'IDSP' :
                tipoFalta = 'Incumplimiento en declaración de situación patrimonial';
                break;
            case 'DCSP' :
                tipoFalta = 'Delito cometido por servidores públicos';
                break;
            case 'EIFM' :
                tipoFalta = 'Ejercicio indebido de sus funciones en materia migratoria';
                break;
            case 'VDH' :
                tipoFalta = 'Violación a los derechos humanos';
                break;
            case 'AG' :
                tipoFalta = 'Administrativa grave';
                break;
            case 'ANG' :
                tipoFalta = 'Administrativa no grave';
                break;
            case 'AC' :
                tipoFalta = 'Acto de corrupción';
                break;
            default :
                tipoFalta = item.tipoFalta.valor ? item.tipoFalta.valor : 'Otra';
                break;
        }
    }
    /* NUEVO MAPEO, DESCOMENTAR CUANDO ESTÉ ACTUALIZADO EL FRONT

        let test = {
            id: item.id ? item.id : leyenda,
            fechaCaptura: item.fechaCaptura && item.fechaCaptura.trim() ? item.fechaCaptura : leyenda,
            expediente: item.expediente ? item.expediente : leyenda,
            institucionDependencia: item.institucionDependencia ? {
                nombre: item.institucionDependencia.nombre ? item.institucionDependencia.nombre : leyenda,
                siglas: item.institucionDependencia.siglas ? item.institucionDependencia.siglas : leyenda
            } : leyenda,
            servidorPublicoSancionado:{
                nombres: item.servidorPublicoSancionado && item.servidorPublicoSancionado.nombres ? item.servidorPublicoSancionado.nombres : '',
                primerApellido: item.servidorPublicoSancionado && item.servidorPublicoSancionado.primerApellido ? item.servidorPublicoSancionado.primerApellido : '',
                segundoApellido: item.servidorPublicoSancionado && item.servidorPublicoSancionado.segundoApellido ? item.servidorPublicoSancionado.segundoApellido : '',
                puesto: item.servidorPublicoSancionado && item.servidorPublicoSancionado.puesto ? item.servidorPublicoSancionado.puesto : leyenda,
                nivel: item.servidorPublicoSancionado && item.servidorPublicoSancionado.nivel ? item.servidorPublicoSancionado.nivel : leyenda
            },
            autoridadSancionadora: item.autoridadSancionadora ? item.autoridadSancionadora : leyenda,
            tipoFalta: tipoFalta,
            tipoSancion: tipoSancion,
            causaMotivoHechos: item.causaMotivoHechos ? item.causaMotivoHechos : leyenda,
            resolucion: item.resolucion ? {
                fechaResolucion: item.resolucion.fechaResolucion ? item.resolucion.fechaResolucion : leyenda
            } : leyenda,
            multa: item.multa ? {
                monto: !isNaN(item.multa.monto) ? item.multa.monto : leyenda,
                moneda: item.multa.moneda && item.multa.moneda.clave ? item.multa.moneda.clave : 'N/A'
            } : leyenda,
            inhabilitacion: item.inhabilitacion ? {
                plazo: item.inhabilitacion.plazo ? item.inhabilitacion.plazo : leyenda,
                fechaInicial: (item.inhabilitacion.fechaInicial ) ? item.inhabilitacion.fechaInicial : leyenda,
                fechaFinal: (item.inhabilitacion.fechaFinal ) ? item.inhabilitacion.fechaFinal : leyenda,
            } : leyenda,
            observaciones: item.observaciones ? item.observaciones : ''
        };
    */
//ANTIGUO MAPEO
    let test = {
        id: item.id ? item.id : leyenda,
        nombre: item.servidorPublicoSancionado && item.servidorPublicoSancionado.nombres ? item.servidorPublicoSancionado.nombres : '',
        apellidoUno: item.servidorPublicoSancionado && item.servidorPublicoSancionado.primerApellido ? item.servidorPublicoSancionado.primerApellido : '',
        apellidoDos: item.servidorPublicoSancionado && item.servidorPublicoSancionado.segundoApellido ? item.servidorPublicoSancionado.segundoApellido : '',
        institucion: item.institucionDependencia ? {
            nombre: item.institucionDependencia.nombre ? item.institucionDependencia.nombre : leyenda,
            siglas: item.institucionDependencia.siglas ? item.institucionDependencia.siglas : leyenda
        } : leyenda,
        autoridad_sancionadora: item.autoridadSancionadora ? item.autoridadSancionadora : leyenda,
        expediente: item.expediente ? item.expediente : leyenda,
        tipo_sancion: tipoSancion,
        causa: item.causaMotivoHechos ? item.causaMotivoHechos : leyenda,
        fecha_captura: item.fechaCaptura ? item.fechaCaptura : leyenda,
        //rfc: item.servidor_publico_sancionado && item.servidor_publico_sancionado.rfc ? item.servidor_publico_sancionado.rfc : leyenda,
        //curp: item.servidor_publico_sancionado && item.servidor_publico_sancionado.curp ? item.servidor_publico_sancionado.curp : leyenda,
        //genero: item.servidor_publico_sancionado && item.servidor_publico_sancionado.genero ? item.servidor_publico_sancionado.genero : leyenda,
        tipo_falta: tipoFalta,
        resolucion: item.resolucion ? {
            fecha_notificacion: item.resolucion.fechaResolucion ? item.resolucion.fechaResolucion : leyenda
        } : leyenda,
        multa: item.multa ? {
            monto: !isNaN(item.multa.monto) ? item.multa.monto : leyenda,
            moneda: item.multa.moneda && item.multa.moneda.clave ? item.multa.moneda.clave : 'N/A'
        } : leyenda,
        inhabilitacion: item.inhabilitacion ? {
            fecha_inicial: (item.inhabilitacion.fechaInicial) ? item.inhabilitacion.fechaInicial : leyenda,
            fecha_final: (item.inhabilitacion.fechaFinal) ? item.inhabilitacion.fechaFinal : leyenda,
            observaciones: item.observaciones ? item.observaciones : ''
        } : leyenda,
        puesto: item.servidorPublicoSancionado && item.servidorPublicoSancionado.puesto ? item.servidorPublicoSancionado.puesto : leyenda,

    }
    return test;
}
/* MAPEO DATOS PARTICULARES SANCIONADOS */
exports.createDataParticularesSancionados = (item, sujetoObligado) => {
    let leyenda = "No existe dato en la base " + sujetoObligado;

    let tipoSancion = (item.tipoSancion && item.tipoSancion.length > 0) ? item.tipoSancion.map(item => {
        switch (item.clave) {
            case 'I' :
                return 'Inhabilitado';
            case 'M' :
                return 'Multado';
            case 'S' :
                return 'Suspensión del empleo, cargo o comisión';
            case 'D' :
                return 'Destitución del empleo, cargo  o comisión';
            case 'A' :
                return 'Amonestado';
        }
    }) : [leyenda];

    /*
        let tipoPersona = (item.tipoPersona && item.tipoPersona.length>0) ? item.tipoPersona.map(item => {
            switch (item.tipoPersona) {
                case 'F':
                    return 'FISICA';
                case 'M' :
                    return  'MORAL';
            }
        }) : leyenda;

        let tipo = (item.tipo && item.tipo.length>0) ? item.tipo.map(item => {
            switch (item.tipo) {
                case 'R':
                    return 'RESOLUCION';
                case 'CS' :
                    return 'CONSTANCIA_SANCION';
                case 'CI':
                    return 'CONSTANCIA_INHABILITACION';
                case 'CA' :
                    return  'CONSTANCIA_ABSTENCION';
            }
        }) : leyenda;

        let tipo = (doc) => {
            switch(doc.tipo){
             case 'R':
                    return 'RESOLUCION';
                case 'CS' :
                    return 'CONSTANCIA_SANCION';
                case 'CI':
                    return 'CONSTANCIA_INHABILITACION';
                case 'CA' :
                    return  'CONSTANCIA_ABSTENCION';
            }
        }

         let documentos =(item.documentos && item.documentos.length>0) ? item.documentos.map(doc =>{
             return {
                titulo : doc.titulo,
                tipo: tipo(doc.tipo)
             }
         })*/

    let mapeoAnterior = {
        id: item.id,
        fecha_captura: item.fechaCaptura ? item.fechaCaptura : leyenda,
        numero_expediente: item.expediente ? item.expediente : leyenda,
        nombre_razon_social: (item.particularSancionado && item.particularSancionado.nombreRazonSocial) ? item.particularSancionado.nombreRazonSocial : leyenda,
        rfc: (item.particularSancionado && item.particularSancionado.rfc) ? item.particularSancionado.rfc : leyenda,
        telefono: (item.particularSancionado && item.particularSancionado.telefono) ? item.particularSancionado.telefono : leyenda,
        domicilio: (item.particularSancionado && item.particularSancionado.domicilio) ? '' : leyenda,
        tipo_sancion: tipoSancion,
        institucion_dependencia: item.institucionDependencia ? {
            nombre: item.institucionDependencia.nombre ? item.institucionDependencia.nombre : leyenda,
            siglas: item.institucionDependencia.siglas ? item.institucionDependencia.siglas : leyenda
        } : leyenda,
        tipo_falta: item.tipoFalta ? item.tipoFalta : leyenda,
        causa_motivo_hechos: item.causaMotivoHechos ? item.causaMotivoHechos : leyenda,
        objetoSocial: item.particularSancionado && item.particularSancionado.objetoSocial ? item.particularSancionado.objetoSocial : leyenda,
        autoridad_sancionadora: item.autoridadSancionadora ? item.autoridadSancionadora : leyenda,
        responsable: item.responsableSancion ? (item.responsableSancion.nombres ? item.responsableSancion.nombres:'' )+ ' ' +
            (item.responsableSancion.primerApellido ? item.responsableSancion.primerApellido:'') + ' '
            + (item.responsableSancion.segundoApellido ? item.responsableSancion.segundoApellido:'') : leyenda,
        resolucion: item.resolucion ? {
            sentido: item.resolucion.sentido ? item.resolucion.sentido : leyenda
        } : leyenda,
        fecha_notificacion: item.resolucion && item.resolucion.fechaNotificacion ? item.resolucion.fechaNotificacion : leyenda,
        multa: item.multa ? {
            monto: item.multa.monto ? item.multa.monto : leyenda,
            moneda: item.multa.moneda ? item.multa.moneda.clave : leyenda
        } : leyenda,
        plazo: (item.inhabilitacion && item.inhabilitacion.fechaInicial && item.inhabilitacion.fechaFinal) ? item.inhabilitacion.fechaInicial + " - " + item.inhabilitacion.fechaFinal : leyenda,
        observaciones: item.observaciones ? item.observaciones : leyenda
    };
/*
    let mapeoNuevo = {
        id: item.id ? item.id : leyenda,
        fechaCaptura: item.fechaCaptura.trim() ? item.fechaCaptura : leyenda,
        expediente: item.expediente ? item.expediente : leyenda,
        institucionDependencia: {
            nombre: item.institucionDependencia && item.institucionDependencia.nombre ? item.institucionDependencia.nombre : leyenda,
            iniciales: institucionDependencia && institucionDependencia.iniciales ? item.institucionDependencia.iniciales : leyenda,
            clave: institucionDependencia && institucionDependencia.clave ? item.institucionDependencia.clave : leyenda,
        },
        particularSancionado: {
            nombreRazonSocial: item.particularSancionado && item.particularSancionado.nombreRazonSocial ? item.particularSancionado.nombreRazonSocial : '',
            objetoSocial: particularSancionado && particularSancionado.objetoSocial ? particularSancionado.objetoSocial : '',
            rfc: particularSancionado && particularSancionado.rfc ? particularSancionado.rfc : '',
            tipoPersona: tipoPersona,
            telefono: particularSancionado && particularSancionado.telefono ? particularSancionado.telefono : leyenda,

            domicilioMexico: {
                pais: {
                    valor: particularSancionado.domicilioMexico && particularSancionado.domicilioMexico.pais && particularSancionado.domicilioMexico.pais.valor ? particularSancionado.domicilioMexico.pais.valor : '',
                    clave: particularSancionado.domicilioMexico && particularSancionado.domicilioMexico.pais && particularSancionado.domicilioMexico.pais.clave ? particularSancionado.domicilioMexico.pais.clave : '',
                },
                entidadFederativa: {
                    valor: particularSancionado.domicilioMexico.entidadFederativa && particularSancionado.domicilioMexico.entidadFederativa.valor ? particularSancionado.domicilioMexico.entidadFederativa.valor : '',
                    clave: particularSancionado.domicilioMexico.entidadFederativa && particularSancionado.domicilioMexico.entidadFederativa.clave ? particularSancionado.domicilioMexico.entidadFederativa.clave : '',
                },
                municipio: {
                    valor: particularSancionado.domicilioMexico.municipio && particularSancionado.domicilioMexico.municipio.valor ? particularSancionado.domicilioMexico.municipio.valor : '',
                    clave: particularSancionado.domicilioMexico.municipio && particularSancionado.domicilioMexico.municipio.clave ? particularSancionado.domicilioMexico.municipio.clave : '',
                },
                codigoPostal: particularSancionado.domicilioMexico && particularSancionado.domicilioMexico.codigoPostal ? particularSancionado.domicilioMexico.codigoPostal : '',

                localidad: {
                    valor: particularSancionado.domicilioMexico.localidad && particularSancionado.domicilioMexico.localidad.valor ? particularSancionado.domicilioMexico.localidad.valor : '',
                    clave: particularSancionado.domicilioMexico.localidad && particularSancionado.domicilioMexico.localidad.clave ? particularSancionado.domicilioMexico.localidad.clave : '',
                },
                vialidad: {
                    valor: particularSancionado.domicilioMexico.vialidad && particularSancionado.domicilioMexico.vialidad.valor ? particularSancionado.domicilioMexico.vialidad.valor : '',
                    clave: particularSancionado.domicilioMexico.vialidad && particularSancionado.domicilioMexico.vialidad.clave ? particularSancionado.domicilioMexico.vialidad.clave : '',
                },
                numeroExterior: particularSancionado.domicilioMexico && particularSancionado.domicilioMexico.numeroExterior ? particularSancionado.domicilioMexico.numeroExterior : '',
                numeroInterior: particularSancionado.domicilioMexico && particularSancionado.domicilioMexico.numeroInterior ? particularSancionado.domicilioMexico.numeroInterior : '',
            },
            domicilioExtranjero: {
                calle: particularSancionado.domicilioExtranjero && particularSancionado.domicilioExtranjero.calle ? particularSancionado.domicilioExtranjero.calle : '',
                numeroExterior: particularSancionado.domicilioExtranjero && particularSancionado.domicilioExtranjero.numeroExterior ? particularSancionado.domicilioExtranjero.numeroExterior : '',
                numeroInterior: particularSancionado.domicilioExtranjero && particularSancionado.domicilioExtranjero.numeroInterior ? particularSancionado.domicilioExtranjero.numeroInterior : '',
                ciudadLocalidad: particularSancionado.domicilioExtranjero && particularSancionado.domicilioExtranjero.ciudadLocalidad ? particularSancionado.domicilioExtranjero.ciudadLocalidad : '',
                estadoProvincia: particularSancionado.domicilioExtranjero && particularSancionado.domicilioExtranjero.estadoProvincia ? particularSancionado.domicilioExtranjero.estadoProvincia : '',
                pais: {
                    clave: particularSancionado.domicilioExtranjero.pais && particularSancionado.domicilioExtranjero.pais.clave ? particularSancionado.domicilioExtranjero.pais.clave : '',
                    valor: particularSancionado.domicilioExtranjero.pais && particularSancionado.domicilioExtranjero.pais.valor ? particularSancionado.domicilioExtranjero.pais.valor : '',
                },
                codigoPostal: particularSancionado.domicilioExtranjero && particularSancionado.domicilioExtranjero.codigoPostal ? particularSancionado.domicilioExtranjero.codigoPostal : '',
            },
            directorGeneral: {
                nombres: particularSancionado.directorGeneral && particularSancionado.directorGeneral.nombres ? particularSancionado.directorGeneral.nombres : leyenda,
                primerApellido: particularSancionado.directorGeneral && particularSancionado.directorGeneral.primerApellido ? particularSancionado.directorGeneral.primerApellido : leyenda,
                segundoApellido: particularSancionado.directorGeneral && particularSancionado.directorGeneral.segundoApellido ? particularSancionado.directorGeneral.segundoApellido : leyenda,
                curp: particularSancionado.directorGeneral && particularSancionado.directorGeneral.curp ? particularSancionado.directorGeneral.curp : leyenda,

            },
            apoderadoLegal: {
                nombres: particularSancionado.apoderadoLegal && particularSancionado.apoderadoLegal.nombres ? particularSancionado.apoderadoLegal.nombres : leyenda,
                primerApellido: particularSancionado.apoderadoLegal && particularSancionado.apoderadoLegal.primerApellido ? particularSancionado.apoderadoLegal.primerApellido : leyenda,
                segundoApellido: particularSancionado.apoderadoLegal && particularSancionado.apoderadoLegal.segundoApellido ? particularSancionado.apoderadoLegal.segundoApellido : leyenda,
                curp: particularSancionado.apoderadoLegal && item.apoderadoLegal.curp ? particularSancionado.apoderadoLegal.curp : leyenda,

            },
        },
        objetoContrato: {
            autoridadSancionadora: objetoContrato && objetoContrato.autoridadSancionadora ? objetoContrato.autoridadSancionadora : leyenda,
            tipoFalta: objetoContrato && objetoContrato.tipoFalta ? objetoContrato.tipoFalta : leyenda,
            tipoSancion: tipoSancion,
            causaMotivoHechos: objetoContrato && objetoContrato.causaMotivoHechos ? objetoContrato.causaMotivoHechos : leyenda,
            acto: objetoContrato && objetoContrato.acto ? objetoContrato.acto : leyenda,
            responsableSancion: {
                nombres: objetoContrato.responsableSancion && objetoContrato.responsableSancion.nombres ? objetoContrato.responsableSancion.nombres : leyenda,
                primerApellido: objetoContrato.responsableSancion && objetoContrato.responsableSancion.primerApellido ? objetoContrato.responsableSancion.primerApellido : leyenda,
                segundoApellido: objetoContrato.responsableSancion && objetoContrato.responsableSancion.segundoApellido ? objetoContrato.responsableSancion.segundoApellido : leyenda,
            },
            resolucion: {
                sentido: objetoContrato.resolucion && objetoContrato.resolucion.sentido ? objetoContrato.resolucion.sentido : '',
                url: objetoContrato.resolucion && objetoContrato.resolucion.url ? objetoContrato.resolucion.url : '',
                fechaNotificacion: objetoContrato.resolucion && objetoContrato.resolucion.fechaNotificacion.trim() ? objetoContrato.resolucion.fechaNotificacion : '',
            },
            multa: {
                monto: objetoContrato.multa && objetoContrato.multa.monto ? objetoContrato.multa.monto : leyenda,
                moneda: {
                    clave: objetoContrato.multa.moneda && objetoContrato.multa.moneda.clave ? objetoContrato.multa.moneda.clave : '',
                    valor: objetoContrato.multa.moneda && objetoContrato.multa.moneda.valor ? objetoContrato.multa.moneda.valor : '',
                },
            },
            inhabilitacion: objetoContrato.inhabilitacion ? {
                plazo: objetoContrato.inhabilitacion && objetoContrato.inhabilitacion.plazo ? objetoContrato.inhabilitacion.plazo : leyenda,
                fechaInicial: (objetoContrato.inhabilitacion && objetoContrato.inhabilitacion.fechaInicial.trim()) ? objetoContrato.inhabilitacion.fechaInicial : leyenda,
                fechaFinal: (objetoContrato.inhabilitacion && objetoContrato.inhabilitacion.fechaFinal.trim()) ? objetoContrato.inhabilitacion.fechaFinal : leyenda,
            } : leyenda,
            observaciones: objetoContrato.observaciones ? objetoContrato.observaciones : '',
        },
        //documentos: documentos,
    };
*/
    return mapeoAnterior;
}
/*ARMA REQUEST SERVIDORES SANCIONADOS */
exports.getBodySS = (filtros) => {
    let query = {};
    if (filtros.nombres) query.nombres = filtros.nombres;
    if (filtros.primer_apellido) query.primerApellido = filtros.primer_apellido
    if (filtros.segundo_apellido) query.segundoApellido = filtros.segundo_apellido
    if (filtros.nombre) query.institucionDependencia = filtros.nombre
    if (filtros.curp) query.curp = filtros.curp
    if (filtros.rfc) query.rfc = filtros.rfc
    return query;
}
/*ARMA REQUEST PARTICULARES SANCIONADOS */
exports.getBodyPS = (filtros) => {
    let query = {};
    if (filtros.id) query.id = filtros.id
    if (filtros.nombre_razon_social) query.nombreRazonSocial = filtros.nombre_razon_social
    if (filtros.rfc) query.rfc = filtros.rfc
    if (filtros.nombre) query.institucionDependencia = filtros.nombre
    if (filtros.numero_expediente) query.expediente = filtros.numero_expediente
    if (filtros.tipoPersona) query.tipoPersona = filtros.tipoPersona
    return query;
}
/*ARMA REQUEST SERVIDORES EN CONTRATACIONES */
exports.getBodySPIC = (filtros) => {
    let query = {};
    if(filtros.nombres) query.nombres = filtros.nombres
    if(filtros.primer_apellido) query.primerApellido = filtros.primer_apellido
    if(filtros.segundo_apellido) query.segundoApellido = filtros.segundo_apellido
    if(filtros.institucion) query.institucionDependencia = filtros.institucion
    if(filtros.procedimiento) {
        switch (filtros.procedimiento) {
            case 'CONTRATACIONES':
                query.tipoProcedimiento = [1];
                break;
            case 'CONCESIONES' :
                query.tipoProcedimiento = [2];
                break;
            case 'ENAJENACIONES' :
                query.tipoProcedimiento = [3];
                break;
            case 'DICTAMENES' :
                query.tipoProcedimiento = [4];
                break;
            default :
                query.tipoProcedimiento = [];
        }
    }
    return query;
}