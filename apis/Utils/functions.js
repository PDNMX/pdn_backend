/* MAPEO DATOS SERVIDORES INTERVIENEN */
export function createDataSIPC(item, sujetoObligado){
    let leyenda = "NO EXISTE DATO EN LA BASE " + sujetoObligado;

    let tipoArea = (item.tipoArea && item.tipoArea.length>0) ? item.tipoArea.map(item => {
        switch (item.clave) {
            case 'T':
                return 'TÉCNICA';
            case 'RE' :
                return 'RESPONSABLE DE LA EJECUCIÓN DE LOS TRABAJOS';
            case 'RC' :
                return 'RESPONSABLE DE LA CONTRATACIÓN';
            case 'C' :
                return 'CONTRATANTE';
            case 'R' :
                return 'REQUIRENTE';
            default :
                return item.valor ? item.valor : 'OTRA';
        }
    }) : leyenda;

    let tipo_procedimiento = (item.tipoProcedimiento && item.tipoProcedimiento.length > 0) ? item.tipoProcedimiento.map(item => {
        switch (item) {
            case 1:
                return 'CONTRATACIONES PÚBLICAS';
            case 2 :
                return 'CONCESIONES, LICENCIAS, PERMISOS, AUTORIZACIONES Y PRÓRROGAS';
            case 3:
                return 'ENAJENACIÓN DE BIENES MUEBLES';
            case 4 :
                return 'ASIGNACIÓN Y EMISIÓN DE DICTÁMENES DE AVALÚOS NACIONALES';
        }
    }) : [leyenda];

    let nivel = (item.nivelResponsabilidad && item.nivelResponsabilidad > 0) ? item.nivelResponsabilidad.map(item => {
        switch (item) {
            case 'A':
                return 'ATENCIÓN';
            case 'T':
                return 'TRAMITACIÓN';
            case 'R':
                return 'RESOLUCIÓN';
        }
        }) : [leyenda];

    return {
        id: item.id ? item.id : leyenda,
        fechaCaptura: item.fechaCaptura  && item.fechaCaptura.trim() ? item.fechaCaptura : leyenda,
        ejercicioFiscal: item.ejercicioFiscal ? item.ejercicioFiscal : leyenda,
        periodoEjercicio: {
            fechaInicial: item.periodoEjercicio && item.periodoEjercicio.fechaInicial && item.periodoEjercicio.fechaInicial.trim() ? item.periodoEjercicio.fechaInicial : leyenda,
            fechaFinal: item.periodoEjercicio && item.periodoEjercicio.fechaFinal && item.periodoEjercicio.fechaFinal.trim() ? item.periodoEjercicio.fechaFinal : leyenda
        },
        ramo: {
            clave: item.ramo && item.ramo.clave ? item.ramo.clave : leyenda,
            valor: item.ramo && item.ramo.valor ? item.ramo.valor.toUpperCase() : leyenda
        },
        nombres: item.nombres ? item.nombres.toUpperCase() : '',
        primerApellido: item.primerApellido ? item.primerApellido.toUpperCase() : '',
        segundoApellido: item.segundoApellido ? item.segundoApellido.toUpperCase() : '',
        servidor: (item.nombres ? item.nombres.toUpperCase() + ' ' : '') + (item.primerApellido ? item.primerApellido.toUpperCase() + ' ' : '') + (item.segundoApellido ? item.segundoApellido.toUpperCase() : ''),
        institucionDependencia: {
            nombre: item.institucionDependencia && item.institucionDependencia.nombre ? item.institucionDependencia.nombre.toUpperCase() : leyenda,
            siglas: item.institucionDependencia && item.institucionDependencia.siglas ? '('+item.institucionDependencia.siglas.toUpperCase()+')' : ''
        },
        puesto: {
            nombre: item.puesto && item.puesto.nombre ? item.puesto.nombre.toUpperCase() : leyenda,
            nivel: item.puesto && item.puesto.nivel ? item.puesto.nivel.toUpperCase() : leyenda
        },
        tipoArea: tipoArea,
       /* contrataciones: item.tipo_procedimiento === 1 ? nivel : "NO APLICA",
        concesionesLicencias: item.tipo_procedimiento === 2 ? nivel : "NO APLICA",
        enajenacion: item.tipo_procedimiento === 3 ? nivel : "NO APLICA",
        dictamenes: item.tipo_procedimiento === 4 ? nivel : "NO APLICA",
       */
        nivelResponsabilidad: nivel,
        tipoProcedimiento: tipo_procedimiento,
        superiorInmediato: {
            nombre: item.superiorInmediato && item.superiorInmediato.nombres ? item.superiorInmediato.nombres.toUpperCase() : leyenda,
            primer_apellido: item.superiorInmediato && item.superiorInmediato.primerApellido ? item.superiorInmediato.primerApellido.toUpperCase() : leyenda,
            segundo_apellido: item.superiorInmediato && item.superiorInmediato.segundoApellido ? item.superiorInmediato.segundoApellido.toUpperCase() : '',
            puesto: {
                nombre: item.superiorInmediato && item.superiorInmediato.puesto && item.superiorInmediato.puesto.nombre ? item.superiorInmediato.puesto.nombre.toUpperCase() : leyenda,
                nivel:  item.superiorInmediato && item.superiorInmediato.puesto && item.superiorInmediato.puesto.nivel ? item.superiorInmediato.puesto.nivel.toUpperCase() : leyenda
            }
        }
    };
}

export function createDataServidoresSanciondos(item, sujetoObligado){
    let leyenda = "NO EXISTE DATO EN LA BASE "+ sujetoObligado;

    let tipoSancion = (item.tipoSancion && item.tipoSancion.length > 0) ? item.tipoSancion.map(item => {
        switch (item.clave) {
            case 'I' : return 'INHABILITADO';
            case 'M' : return 'MULTADO';
            case 'S' : return 'SUSPENSIÓN DEL EMPLEO, CARGO O COMISIÓN';
            case 'D' : return 'DESTITUCIÓN DEL EMPLEO, CARGO O COMISIÓN';
        }
    }): [leyenda];

    let tipoFalta = leyenda ;
    if(item.tipoFalta && item.tipoFalta.clave){
        switch(item.tipoFalta.clave){
            case 'NAD' :  tipoFalta = 'NEGLIGENCIA ADMINISTRATIVA'; break;
            case 'VPC' :  tipoFalta = 'VIOLACION PROCEDIMIENTOS DE CONTRATACIÓN'; break;
            case 'VLNP' : tipoFalta = 'VIOLACION LEYES Y NORMATIVIDAD PRESUPUESTAL'; break;
            case 'AUT' :  tipoFalta = 'ABUSO DE AUTORIDAD'; break;
            case 'CEX' :  tipoFalta = 'COHECHO O EXTORSION'; break;
            case 'IDSP' : tipoFalta =  'INCUMPLIMIENTO EN DECLARACION DE SITUACION PATRIMONIAL'; break;
            case 'DCSP' :  tipoFalta = 'DELITO COMETIDO POR SERVIDORES PUBLICOS';break;
            case 'EIFM' :  tipoFalta = 'EJERCICIO INDEBIDO DE SUS FUNCIONES EN MATERIA MIGRATORIA';break;
            case 'VDH' :  tipoFalta = 'VIOLACIÓN A LOS DERECHOS HUMANOS';break;
            case 'AG' :  tipoFalta = 'ADMINISTRATIVA GRAVE';break;
            case 'ANG' :  tipoFalta = 'ADMINISTRATIVA NO GRAVE';break;
            case 'AC' :  tipoFalta = 'ACTO DE CORRUPCIÓN';break;
            default :  tipoFalta = item.tipoFalta.valor ? item.tipoFalta.valor : 'OTRA';break;
        }
    }


    return {
        id: item.id ? item.id : leyenda,
        fechaCaptura: item.fechaCaptura && item.fechaCaptura.trim() ? item.fechaCaptura : leyenda,
        expediente: item.expediente ? item.expediente : leyenda,
        institucionDependencia: item.institucionDependencia ? {
            nombre: item.institucionDependencia.nombre ? item.institucionDependencia.nombre.toUpperCase() : leyenda,
            siglas: item.institucionDependencia.siglas ? item.institucionDependencia.siglas.toUpperCase() : leyenda
        } : leyenda,
        servidorPublicoSancionado:{
            nombres: item.servidorPublicoSancionado && item.servidorPublicoSancionado.nombres ? item.servidorPublicoSancionado.nombres.toUpperCase() : '',
            primerApellido: item.servidorPublicoSancionado && item.servidorPublicoSancionado.primerApellido ? item.servidorPublicoSancionado.primerApellido.toUpperCase() : '',
            segundoApellido: item.servidorPublicoSancionado && item.servidorPublicoSancionado.segundoApellido ? item.servidorPublicoSancionado.segundoApellido.toUpperCase() : '',
            puesto: item.servidorPublicoSancionado && item.servidorPublicoSancionado.puesto ? item.servidorPublicoSancionado.puesto.toUpperCase() : leyenda,
            nivel: item.servidorPublicoSancionado && item.servidorPublicoSancionado.nivel ? item.servidorPublicoSancionado.nivel.toUpperCase() : leyenda
        },
        autoridadSancionadora: item.autoridadSancionadora ? item.autoridadSancionadora.toUpperCase() : leyenda,
        tipoFalta: tipoFalta,
        tipoSancion: tipoSancion,
        causaMotivoHechos: item.causaMotivoHechos ? item.causaMotivoHechos.toUpperCase() : leyenda,
        resolucion: item.resolucion ? {
            fechaResolucion: item.resolucion.fechaResolucion ? item.resolucion.fechaResolucion : leyenda
        } : leyenda,
        multa: item.multa ? {
            monto: item.multa.monto ? item.multa.monto : leyenda,
            moneda: item.multa.moneda && item.multa.moneda.clave ? item.multa.moneda.clave : 'N/A'
        } : leyenda,
        inhabilitacion: item.inhabilitacion ? {
            plazo: item.inhabilitacion.plazo ? item.inhabilitacion.plazo : leyenda,
            fechaInicial: (item.inhabilitacion.fechaInicial && item.inhabilitacion.fecha_inicial.trim()) ? item.inhabilitacion.fechaInicial : leyenda,
            fechaFinal: (item.inhabilitacion.fechaFinal && item.inhabilitacion.fechaFinal.trim()) ? item.inhabilitacion.fechaFinal : leyenda,
        } : leyenda,
        observaciones: item.observaciones ? item.observaciones : ''
    };
}