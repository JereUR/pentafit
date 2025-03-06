interface Exercise {
  exercise: string
  photo: string
}

interface ExercisesDataStructure {
  Zonas: string[]
  [key: string]: string[] | Exercise[]
}

export const exercisesData = {
  exercises: {
    Zonas: [
      "Abdominales y lumbares",
      "Antebrazos",
      "Biceps",
      "Dorsales",
      "Hombros y cuello",
      "Pectorales",
      "Piernas",
      "Triceps",
    ] as string[],
    "Abdominales y lumbares": [
      {
        exercise: "Contracciones en máquina sentado",
        photo:
          "/images/exercises/AbdominalesYLumbares/ContraccionesEnMaquinaSentado.png",
      },
      {
        exercise:
          "Contracciones en máquina sentado en máquina de press pectoral",
        photo:
          "/images/exercises/AbdominalesYLumbares/ContraccionesEnMaquinaSentadoEnMaquinaDePressPectoral.png",
      },
      {
        exercise: "Contracciones en máquina sentado inferior",
        photo:
          "/images/exercises/AbdominalesYLumbares/ContraccionesEnMaquinaSentadoInferior.png",
      },
      {
        exercise: "Contracciones en polea alta",
        photo:
          "/images/exercises/AbdominalesYLumbares/ContraccionesEnPoleaAlta.png",
      },
      {
        exercise: "Contracciones en polea alta de rodillas",
        photo:
          "/images/exercises/AbdominalesYLumbares/ContraccionesEnPoleaAltaDeRodillas.png",
      },
      {
        exercise: "Contracciones en polea alta laterales",
        photo:
          "/images/exercises/AbdominalesYLumbares/ContraccionesEnPoleaAltaLaterales.png",
      },
      {
        exercise: "Contracciones tumbado",
        photo:
          "/images/exercises/AbdominalesYLumbares/ContraccionesTumbado.png",
      },
      {
        exercise: "Contacciones tumbado brazos al frente",
        photo:
          "/images/exercises/AbdominalesYLumbares/ContraccionesTumbadoBrazosAlFrente.png",
      },
      {
        exercise: "Contacciones tumbado con giro",
        photo:
          "/images/exercises/AbdominalesYLumbares/ContraccionesTumbadoConGiro.png",
      },
      {
        exercise: "Contacciones tumbado declinado",
        photo:
          "/images/exercises/AbdominalesYLumbares/ContraccionesTumbadoDeclinado.png",
      },
      {
        exercise: "Descenso vertical invertido en plancha",
        photo:
          "/images/exercises/AbdominalesYLumbares/DescensoVerticalInvertidoEnPlancha.png",
      },
      {
        exercise: "Elevación de tronco suspendido por los pies",
        photo:
          "/images/exercises/AbdominalesYLumbares/ElevacionDeTroncoSuspendidoPorLosPies.png",
      },
      {
        exercise: "Elevaciones de pelvis en banco vertical",
        photo:
          "/images/exercises/AbdominalesYLumbares/ElevacionesDePelvisEnBancoVertical.png",
      },
      {
        exercise: "Elevaciones de pelvis en barra",
        photo:
          "/images/exercises/AbdominalesYLumbares/ElevacionesDePelvisEnBarra.png",
      },
      {
        exercise: "Elevaciones de pelvis en espalderas",
        photo:
          "/images/exercises/AbdominalesYLumbares/ElevacionesDePelvisEnEspalderas.png",
      },
      {
        exercise: "Elevaciones de tronco en banco/silla romana",
        photo:
          "/images/exercises/AbdominalesYLumbares/ElevacionesDeTroncoEnBancoSillaConGiro.png",
      },
      {
        exercise: "Elevaciones de tronco en banco/silla romana con giro",
        photo:
          "/images/exercises/AbdominalesYLumbares/ElevacionesDeTroncoEnBancoSillaConGiro.png",
      },
      {
        exercise: "Elevaciones de tronco en banco/silla romana con lastre",
        photo:
          "/images/exercises/AbdominalesYLumbares/ElevacionesDeTroncoEnBancoSillaConLastre.png",
      },
      {
        exercise: "Elevaciones de tronco en banco vertical",
        photo:
          "/images/exercises/AbdominalesYLumbares/ElevacionesDeTroncoEnBancoVertical.png",
      },
      {
        exercise: "Elevaciones de tronco en polea baja",
        photo:
          "/images/exercises/AbdominalesYLumbares/ElevacionesDeTroncoEnPoleaBaja.png",
      },
      {
        exercise: "Elevaciones laterales tumbado",
        photo:
          "/images/exercises/AbdominalesYLumbares/ElevacionesLateralesTumbado.png",
      },
      {
        exercise: "Elevaciones laterales tumbado levantando piernas",
        photo:
          "/images/exercises/AbdominalesYLumbares/ElevacionesLateralesTumbadoLevantandoPiernas.png",
      },
      {
        exercise: "Elevaciones verticales de piernas, rodillas al pecho",
        photo:
          "/images/exercises/AbdominalesYLumbares/ElevacionesVerticalesDePiernasRodillasAlPecho.png",
      },
      {
        exercise: "Elevaciones verticales de piernas, tijeras",
        photo:
          "/images/exercises/AbdominalesYLumbares/ElevacionesVerticalesDePiernasTijeras.png",
      },
      {
        exercise: "Elevaciones verticales de piernas, tumbado",
        photo:
          "/images/exercises/AbdominalesYLumbares/ElevacionesVerticalesDePiernasTumbado.png",
      },
      {
        exercise: "Extensiones del tronco en banco horizontal",
        photo:
          "/images/exercises/AbdominalesYLumbares/ExtensionesDelTroncoEnBancoHorizontal.png",
      },
      {
        exercise: "Extensiones del tronco en banco inclinado",
        photo:
          "/images/exercises/AbdominalesYLumbares/ExtensionesDelTroncoEnBancoInclinado.png",
      },
      {
        exercise: "Extensiones del tronco en banco inclinado con lastre",
        photo:
          "/images/exercises/AbdominalesYLumbares/ExtensionesDelTroncoEnBancoInclinadoConLastre.png",
      },
      {
        exercise: "Extensiones de tronco en máquina de lumbar",
        photo:
          "/images/exercises/AbdominalesYLumbares/ExtensionesDeTroncoEnMaquinaDeLumbar.png",
      },
      {
        exercise: "Extensiones de tronco en polea baja",
        photo:
          "/images/exercises/AbdominalesYLumbares/ExtensionesDeTroncoEnPoleaBaja.png",
      },
      {
        exercise: "Extensiones de tronco en remo sentado",
        photo:
          "/images/exercises/AbdominalesYLumbares/ExtensionesDeTroncoEnRemoSentado.png",
      },
      {
        exercise: "Extensiones de tronco, peso muerto en multipower",
        photo:
          "/images/exercises/AbdominalesYLumbares/ExtensionesDeTroncoPesoMuertoEnMultipower.png",
      },
      {
        exercise: "Extensiones de tronco, peso muerto en polea baja",
        photo:
          "/images/exercises/AbdominalesYLumbares/ExtensionesDeTroncoPesoMuertoEnPoleaBaja.png",
      },
      {
        exercise: "Giros con pica/barra",
        photo: "/images/exercises/AbdominalesYLumbares/GirosConPica.png",
      },
      {
        exercise: "Giros con pica/barra en banco inclinado",
        photo:
          "/images/exercises/AbdominalesYLumbares/GirosConPicaEnBancoInclinado.png",
      },
      {
        exercise: "Giros con pica/barra sentado",
        photo: "/images/exercises/AbdominalesYLumbares/GirosConPicaSentado.png",
      },
      {
        exercise: "Giros de piernas juntas tumbado",
        photo:
          "/images/exercises/AbdominalesYLumbares/GirosDePiernasJuntasTumbado.png",
      },
      {
        exercise: "Giros en disco",
        photo: "/images/exercises/AbdominalesYLumbares/GirosEnDisco.png",
      },
      {
        exercise: "Giros en disco en máquina sentado",
        photo:
          "/images/exercises/AbdominalesYLumbares/GirosEnDiscoEnMaquinaSentado.png",
      },
      {
        exercise: "Giros en polea",
        photo: "/images/exercises/AbdominalesYLumbares/GirosEnPolea.png",
      },
      {
        exercise: "Inclinaciones/flexiones laterales con mancuerna",
        photo:
          "/images/exercises/AbdominalesYLumbares/InclinacionesFlexionesLateralesConMancuerna.png",
      },
      {
        exercise: "Inclinaciones/flexiones laterales con pica/barra",
        photo:
          "/images/exercises/AbdominalesYLumbares/InclinacionesFlexionesLateralesConPica.png",
      },
      {
        exercise: "Patadas de rana/tijeras/uve/carpa",
        photo:
          "/images/exercises/AbdominalesYLumbares/PatadasDeRanaTijerasUveCarpa.png",
      },
      {
        exercise: "Patadas de rana/tijeras/uve/carpa sin manos",
        photo:
          "/images/exercises/AbdominalesYLumbares/PatadasDeRanaTijerasUveCarpaSinManos.png",
      },
      {
        exercise: "Patadas de rana/tijeras/uve/carpa tocando los pies arriba",
        photo:
          "/images/exercises/AbdominalesYLumbares/PatadasDeRanaTijerasUveCarpaTocandoLosPiesArriba.png",
      },
      {
        exercise: "Peso muerto",
        photo: "/images/exercises/AbdominalesYLumbares/PesoMuerto.png",
      },
      {
        exercise: "Peso muerto buenos dias",
        photo:
          "/images/exercises/AbdominalesYLumbares/PesoMuertoBuenosDias.png",
      },
      {
        exercise: "Peso muerto con mancuernas",
        photo:
          "/images/exercises/AbdominalesYLumbares/PesoMuertoConMancuernas.png",
      },
    ],
    Antebrazos: [
      {
        exercise: "Abduciones/Flexiones cubitales/aducciones ulnares tumbado",
        photo:
          "/images/exercises/Antebrazos/AbducionesFlexionesCubitalesTumbado.png",
      },
      {
        exercise: "Abduciones/Flexiones radiales sentado",
        photo:
          "/images/exercises/Antebrazos/AbducionesFlexionesRadialesSentado.png",
      },
      {
        exercise:
          "Abduciones/Flexiones radiales sentado, giros de prono supinación",
        photo:
          "/images/exercises/Antebrazos/AbducionesFlexionesRadialesSentadoGirosDePronoSupinacion.png",
      },
      {
        exercise: "Curl con barra en pronación",
        photo: "/images/exercises/Antebrazos/CurlConBarraEnPronacion.png",
      },
      {
        exercise: "Curl con mancuernas en pronación",
        photo: "/images/exercises/Antebrazos/CurlConMancuernasEnPronacion.png",
      },
      {
        exercise: "Curl/Flexiones de antebrazo con barra",
        photo:
          "/images/exercises/Antebrazos/CurlFlexionesDeAntebrazoConBarra.png",
      },
      {
        exercise: "Curl/Flexiones de antebrazo con barra sentado",
        photo:
          "/images/exercises/Antebrazos/CurlFlexionesDeAntebrazoConBarraSentado.png",
      },
      {
        exercise: "Curl/Flexiones de antebrazo con mancuerna sentado",
        photo:
          "/images/exercises/Antebrazos/CurlFlexionesDeAntebrazoConMancuernaSentado.png",
      },
      {
        exercise: "Enrollamiento de cuerda dorsal",
        photo: "/images/exercises/Antebrazos/EnrollamientoDeCuerdaDorsal.png",
      },
      {
        exercise: "Enrollamiento de cuerda palmar",
        photo: "/images/exercises/Antebrazos/EnrollamientoDeCuerdaPalmar.png",
      },
      {
        exercise: "Enrollamiento en máquina de rodillo",
        photo:
          "/images/exercises/Antebrazos/EnrollamientoEnMaquinaDeRodillo.png",
      },
      {
        exercise: "Extensiones con barra sentado",
        photo: "/images/exercises/Antebrazos/ExtensionesConBarraSentado.png",
      },
      {
        exercise: "Extensiones con mancuerna sentado",
        photo:
          "/images/exercises/Antebrazos/ExtensionesConMancuernaSentado.png",
      },
      {
        exercise: "Extensiones con polea baja",
        photo: "/images/exercises/Antebrazos/ExtensionesEnPoleaBaja.png",
      },
    ],
    Biceps: [
      {
        exercise: "Curl con barra",
        photo: "/images/exercises/Biceps/CurlConBarra.png",
      },
      {
        exercise: "Curl con barra sentado",
        photo: "/images/exercises/Biceps/CurlConBarraSentado.png",
      },
      {
        exercise: "Curl concentrado al aire",
        photo: "/images/exercises/Biceps/CurlConcentradoAlAire.png",
      },
      {
        exercise: "Curl concentrado/apoyo en banco",
        photo: "/images/exercises/Biceps/CurlConcentradoApoyoEnBanco.png",
      },
      {
        exercise: "Curl concentrado/apoyo en muslo",
        photo: "/images/exercises/Biceps/CurlConcentradoApoyoEnMuslo.png",
      },
      {
        exercise: "Curl con mancuerna y giro",
        photo: "/images/exercises/Biceps/CurlConMancuernaYGiro.png",
      },
      {
        exercise: "Curl con mancuerna y giro en banco inclinado",
        photo:
          "/images/exercises/Biceps/CurlConMancuernaYGiroEnBancoInclinado.png",
      },
      {
        exercise: "Curl con mancuerna y giro en martillo",
        photo: "/images/exercises/Biceps/CurlConMancuernaYGiroEnMartillo.png",
      },
      {
        exercise: "Curl con mancuerna y giro en pronación",
        photo: "/images/exercises/Biceps/CurlConMancuernaYGiroEnPronacion.png",
      },
      {
        exercise: "Curl con mancuerna y giro en supinación",
        photo: "/images/exercises/Biceps/CurlConMancuernaYGiroEnSupinacion.png",
      },
      {
        exercise: "Curl de barra con apoyo en banco/Scott",
        photo: "/images/exercises/Biceps/CurlDeBarraConApoyoEnBancoScott.png",
      },
      {
        exercise: "Curl de mancuerna a una mano con apoyo en banco/Scott",
        photo:
          "/images/exercises/Biceps/CurlDeMancuernaAUnaManoConApoyoEnBancoScott.png",
      },
      {
        exercise:
          "Curl de mancuerna a una mano tipo martillo con apoyo en banco/Scott",
        photo:
          "/images/exercises/Biceps/CurlDeMancuernaAUnaManoTipoMartilloConApoyoEnBancoScott.png",
      },
      {
        exercise:
          "Curl de mancuerna a una mano y giro con apoyo en banco/Scott",
        photo:
          "/images/exercises/Biceps/CurlDeMancuernaAUnaManoYGiroConApoyoEnBancoScott.png",
      },
      {
        exercise: "Curl en máquina",
        photo: "/images/exercises/Biceps/CurlEnMaquina.png",
      },
      {
        exercise: "Curl en máquina agarre neutro/martillo",
        photo: "/images/exercises/Biceps/CurlEnMaquinaAgarreNeutroMartillo.png",
      },
      {
        exercise: "Curl en polea alta a dos manos",
        photo: "/images/exercises/Biceps/CurlEnPoleaAltaADosManos.png",
      },
      {
        exercise: "Curl en polea alta a una mano",
        photo: "/images/exercises/Biceps/CurlEnPoleaAltaAUnaMano.png",
      },
      {
        exercise: "Curl en polea baja",
        photo: "/images/exercises/Biceps/CurlEnPoleaBaja.png",
      },
      {
        exercise: "Curl en polea baja a una mano, de espaldas",
        photo: "/images/exercises/Biceps/CurlEnPoleaBajaAUnaManoDeEspaldas.png",
      },
      {
        exercise: "Curl en polea baja en cuclillas",
        photo: "/images/exercises/Biceps/CurlEnPoleaBajaEnCuclillas.png",
      },
      {
        exercise: "Curl en polea baja tumbado",
        photo: "/images/exercises/Biceps/CurlEnPoleaBajaTumbado.png",
      },
      {
        exercise: "Curl Scott/banco en polea baja",
        photo: "/images/exercises/Biceps/CurlScottBancoEnPoleaBaja.png",
      },
      {
        exercise: "Curl tumbado",
        photo: "/images/exercises/Biceps/CurlTumbado.png",
      },
      {
        exercise: "Curl  Zottman/con giro completo",
        photo: "/images/exercises/Biceps/CurlZottmanConGiroCompleto.png",
      },
      {
        exercise: "Dominadas para bíceps",
        photo: "/images/exercises/Biceps/DominadasParaBiceps.png",
      },
      {
        exercise: "Flexiones de brazo en cruz tumbado sobre banco en polea",
        photo:
          "/images/exercises/Biceps/FlexionesDeBrazoEnCruzTumbadoSobreBancoEnPolea.png",
      },
      {
        exercise: "Recostado en banco",
        photo: "/images/exercises/Biceps/RecostadoEnBanco.png",
      },
    ],
    Dorsales: [
      {
        exercise: "Aducción de codos en máquina",
        photo: "/images/exercises/Dorsales/AduccionDeCodosEnMaquina.png",
      },
      {
        exercise: "Cruce de poleas por la espalda",
        photo: "/images/exercises/Dorsales/CruceDePoleasPorLaEspalda.png",
      },
      {
        exercise: "Dominadas",
        photo: "/images/exercises/Dorsales/Dominadas.png",
      },
      {
        exercise: "Dominadas barra a la cintura",
        photo: "/images/exercises/Dorsales/DominadasBarraALaCintura.png",
      },
      {
        exercise: "Dominadas en barra baja y apoyo de pies",
        photo:
          "/images/exercises/Dorsales/DominadasEnBarraBajaYApoyoDePies.png",
      },
      {
        exercise: "Dominadas en máquina con ayuda",
        photo: "/images/exercises/Dorsales/DominadasEnMaquinaConAyuda.png",
      },
      {
        exercise: "Dominadas en máquina con ayuda a una mano",
        photo:
          "/images/exercises/Dorsales/DominadasEnMaquinaConAyudaAUnaMano.png",
      },
      {
        exercise: "Dominadas en supinación/para bíceps",
        photo: "/images/exercises/Dorsales/DominadasEnSupinacionParaBiceps.png",
      },
      {
        exercise: "Dominadas neutro/a dos manos alterno",
        photo: "/images/exercises/Dorsales/DominadasNeutroADosManosAlterno.png",
      },
      {
        exercise: "Dominadas tras nuca",
        photo: "/images/exercises/Dorsales/DominadasTrasNuca.png",
      },
      {
        exercise: "Extensiones de brazos rectos con barra",
        photo:
          "/images/exercises/Dorsales/ExtensionesDeBrazosRectosConBarra.png",
      },
      {
        exercise: "Jalón a una mano",
        photo: "/images/exercises/Dorsales/JalonAUnaMano.png",
      },
      {
        exercise: "Jalón a una mano sentado de lado",
        photo: "/images/exercises/Dorsales/JalonAUnaManoSentadoDeLado.png",
      },
      {
        exercise: "Jalón a una mano sentado en el suelo",
        photo: "/images/exercises/Dorsales/JalonAUnaManoSentadoEnElSuelo.png",
      },
      {
        exercise: "Jalón polea al pecho",
        photo: "/images/exercises/Dorsales/JalonPoleaAlPecho.png",
      },
      {
        exercise: "Jalón polea al pecho invertido/en supinación",
        photo:
          "/images/exercises/Dorsales/JalonPoleaAlPechoInvertidoEnSupinacion.png",
      },
      {
        exercise: "Jalón polea al pecho tumbado",
        photo: "/images/exercises/Dorsales/JalonPoleaAlPechoTumbado.png",
      },
      {
        exercise: "Jalón polea tras nuca",
        photo: "/images/exercises/Dorsales/JalonPoleaTrasNuca.png",
      },
      {
        exercise: "Máquina de dorsal/Jalón en máquina",
        photo: "/images/exercises/Dorsales/MaquinaDeDorsalJalonEnMaquina.png",
      },
      {
        exercise: "Máquina de dorsal/Jalón en máquina a una mano en palanca",
        photo:
          "/images/exercises/Dorsales/MaquinaDeDorsalJalonEnMaquinaAUnaManoEnPalanca.png",
      },
      {
        exercise:
          "Máquina de dorsal/Jalón en máquina a una mano y parada abajo",
        photo:
          "/images/exercises/Dorsales/MaquinaDeDorsalJalonEnMaquinaAUnaManoYParadaAbajo.png",
      },
      {
        exercise: "Pull over con barra",
        photo: "/images/exercises/Dorsales/PullOverConBarra.png",
      },
      {
        exercise: "Pull over con dos mancuernas alterno",
        photo: "/images/exercises/Dorsales/PullOverConDosMancuernasAlterno.png",
      },
      {
        exercise: "Pull over con mancuerna",
        photo: "/images/exercises/Dorsales/PullOverConMancuerna.png",
      },
      {
        exercise: "Pull over con mancuerna en banco cruzado",
        photo:
          "/images/exercises/Dorsales/PullOverConMancuernaEnBancoCruzado.png",
      },
      {
        exercise: "Pull over en máquina sentado",
        photo: "/images/exercises/Dorsales/PullOverEnMaquinaSentado.png",
      },
      {
        exercise: "Pull over en polea alta",
        photo: "/images/exercises/Dorsales/PullOverEnPoleaAlta.png",
      },
      {
        exercise: "Remo con barra",
        photo: "/images/exercises/Dorsales/RemoConBarra.png",
      },
      {
        exercise: "Remo con barra en supinación",
        photo: "/images/exercises/Dorsales/RemoConBarraEnSupinacion.png",
      },
      {
        exercise: "Remo con barra sobre banco",
        photo: "/images/exercises/Dorsales/RemoConBarraSobreBanco.png",
      },
      {
        exercise: "Remo con mancuerna",
        photo: "/images/exercises/Dorsales/RemoConMancuerna.png",
      },
      {
        exercise: "Remo con mancuerna abierto",
        photo: "/images/exercises/Dorsales/RemoConMancuernaAbierto.png",
      },
      {
        exercise: "Remo con mancuerna, cuerpo elevado",
        photo: "/images/exercises/Dorsales/RemoConMancuernaCuerpoElevado.png",
      },
      {
        exercise: "Remo con mancuernas",
        photo: "/images/exercises/Dorsales/RemoConMancuernas.png",
      },
      {
        exercise: "Remo con mancuernas, agarre estrecho",
        photo: "/images/exercises/Dorsales/RemoConMancuernasAgarreEstrecho.png",
      },
      {
        exercise: "Remo con mancuernas, extensiones de brazos rectos",
        photo:
          "/images/exercises/Dorsales/RemoConMancuernasExtensionesDeBrazosRectos.png",
      },
      {
        exercise: "Remo de pie en polea alta",
        photo: "/images/exercises/Dorsales/RemoDePieEnPoleaAlta.png",
      },
      {
        exercise: "Remo de pie en polea baja",
        photo: "/images/exercises/Dorsales/RemoDePieEnPoleaBaja.png",
      },
      {
        exercise: "Remo de pie en polea baja a una mano",
        photo: "/images/exercises/Dorsales/RemoDePieEnPoleaBajaAUnaMano.png",
      },
      {
        exercise: "Remo de pie en polea baja en supinación",
        photo:
          "/images/exercises/Dorsales/RemoDePieEnPoleaBajaEnSupinacion.png",
      },
      {
        exercise: "Remo en máquina",
        photo: "/images/exercises/Dorsales/RemoEnMaquina.png",
      },
      {
        exercise: "Remo en máquina a una mano",
        photo: "/images/exercises/Dorsales/RemoEnMaquinaAUnaMano.png",
      },
      {
        exercise: "Remo en máquina abierto",
        photo: "/images/exercises/Dorsales/RemoEnMaquinaAbierto.png",
      },
      {
        exercise: "Remo en máquina vertical",
        photo: "/images/exercises/Dorsales/RemoEnMaquinaVertical.png",
      },
      {
        exercise: "Remo en multipower",
        photo: "/images/exercises/Dorsales/RemoEnMultipower.png",
      },
      {
        exercise: "Remo en polea alta",
        photo: "/images/exercises/Dorsales/RemoEnPoleaAlta.png",
      },
      {
        exercise: "Remo en polea/Gironda",
        photo: "/images/exercises/Dorsales/RemoEnPoleaGironda.png",
      },
      {
        exercise: "Remo en polea/Gironda, agarre abierto",
        photo: "/images/exercises/Dorsales/RemoEnPoleaGirondaAgarreAbierto.png",
      },
      {
        exercise: "Remo en polea/Gironda a una mano",
        photo: "/images/exercises/Dorsales/RemoEnPoleaGirondaAUnaMano.png",
      },
      {
        exercise: "Remo en punta",
        photo: "/images/exercises/Dorsales/RemoEnPunta.png",
      },
      {
        exercise: "Remo en punta a una mano",
        photo: "/images/exercises/Dorsales/RemoEnPuntaAUnaMano.png",
      },
      {
        exercise: "Remo en punta abierto",
        photo: "/images/exercises/Dorsales/RemoEnPuntaAbierto.png",
      },
      {
        exercise: "Tracción a una mano lateral",
        photo: "/images/exercises/Dorsales/TraccionAUnaManoLateral.png",
      },
    ],
    "Hombros y cuello": [
      {
        exercise: "Depresión de hombros en paralelas",
        photo:
          "/images/exercises/HombrosYCuellos/DepresionDeHombrosEnParalelas.png",
      },
      {
        exercise: "Elevaciones/Encogimientos de hombros con barra",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesEncogimientosDeHombrosConBarra.png",
      },
      {
        exercise: "Elevaciones/Encogimientos de hombros con mancuernas",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesEncogimientosDeHombrosConMancuernas.png",
      },
      {
        exercise:
          "Elevaciones/Encogimientos de hombros con mancuernas, con giro",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesEncogimientosDeHombrosConMancuernasConGiro.png",
      },
      {
        exercise: "Elevaciones/Encogimientos de hombros en multipower",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesEncogimientosDeHombrosEnMultipower.png",
      },
      {
        exercise: "Elevaciones/Encogimientos de hombros en polea a una mano",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesEncogimientosDeHombrosEnPoleaAUnaMano.png",
      },
      {
        exercise: "Elevaciones/Encogimientos de hombros en polea baja",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesEncogimientosDeHombrosEnPoleaBaja.png",
      },
      {
        exercise:
          "Elevaciones/Encogimientos de hombros en polea con extensión al frente",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesEncogimientosDeHombrosEnPoleaConExtensionAlFrente.png",
      },
      {
        exercise:
          "Elevaciones/Encogimientos de hombros en una máquina vertical de dorsal",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesEncogimientosDeHombrosEnUnaMaquinaVerticalDeDorsal.png",
      },
      {
        exercise: "Elevaciones frontales en polea baja",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesFrontalesEnPoleaBaja.png",
      },
      {
        exercise: "Elevaciones frontales en polea baja, de frente a la polea",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesFrontalesEnPoleaBajaDeFrenteALaPolea.png",
      },
      {
        exercise: "Elevaciones frontales/Flexiones",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesFrontalesFlexiones.png",
      },
      {
        exercise: "Elevaciones frontales/Flexiones con barra",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesFrontalesFlexionesConBarra.png",
      },
      {
        exercise: "Elevaciones frontales/Flexiones con disco/mancuerna",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesFrontalesFlexionesConDiscoMancuerna.png",
      },
      {
        exercise:
          "Elevaciones frontales/Flexiones, manos en posición neutra/martillo",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesFrontalesFlexionesManosEnPosicionNeutraMartillo.png",
      },
      {
        exercise: "Elevaciones frontales/Flexiones simultáneo a dos manos",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesFrontalesFlexionesSimultaneoADosManos.png",
      },
      {
        exercise: "Elevaciones frontales inclinado",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesFrontalesInclinado.png",
      },
      {
        exercise: "Elevaciones laterales a una mano",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesAUnaMano.png",
      },
      {
        exercise: "Elevaciones laterales a una mano con barra",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesAUnaManoConBarra.png",
      },
      {
        exercise: "Elevaciones laterales a una mano, cuerpo declinado",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesAUnaManoCuerpoDeclinado.png",
      },
      {
        exercise: "Elevaciones laterales a una mano, cuerpo inclinado",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesAUnaManoCuerpoInclinado.png",
      },
      {
        exercise: "Elevaciones laterales a una mano tumbado",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesAUnaManoTumbado.png",
      },
      {
        exercise: "Elevaciones laterales con mancuernas",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesConMancuernas.png",
      },
      {
        exercise: "Elevaciones laterales con mancuernas, elevaciones completas",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesConMancuernasElevacionesCompletas.png",
      },
      {
        exercise:
          "Elevaciones laterales con mancuernas, extensiones en cruz directa",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesConMancuernasExtensionesEnCruzDirectas.png",
      },
      {
        exercise: "Elevaciones laterales con mancuernas, pulgares hacia abajo",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesConMancuernasPulgaresAbajo.png",
      },
      {
        exercise: "Elevaciones laterales con mancuernas, pulgares hacia arriba",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesConMancuernasPulgaresArriba.png",
      },
      {
        exercise: "Elevaciones laterales en máquina",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesEnMaquina.png",
      },
      {
        exercise: "Elevaciones laterales en máquina a una mano",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesEnMaquinaAUnaMano.png",
      },
      {
        exercise: "Elevaciones laterales en máquina inclinado",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesEnMaquinaInclinado.png",
      },
      {
        exercise: "Elevaciones laterales en polea baja a una mano",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesEnPoleaBajaAUnaMano.png",
      },
      {
        exercise: "Elevaciones laterales en polea baja a una mano por detrás",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesEnPoleaBajaAUnaManoPorDetras.png",
      },
      {
        exercise: "Elevaciones laterales en polea baja cruzando a dos manos",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesLateralesEnPoleaBajaCruzandoADosManos.png",
      },
      {
        exercise: "Elevaciones posterioes/Pájaros de pie",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesPosterioresPajarosDePie.png",
      },
      {
        exercise: "Elevaciones posterioes/Pájaros recostado a una mano",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesPosterioresPajarosRecostadoAUnaMano.png",
      },
      {
        exercise: "Elevaciones posterioes/Pájaros recostado sobre un banco",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesPosterioresPajarosRecostadoSobreUnBanco.png",
      },
      {
        exercise: "Elevaciones posterioes/Pájaros sentado",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesPosterioresPajarosSentado.png",
      },
      {
        exercise:
          "Elevaciones posterioes/Pájaros tumbado sobre codos elevando tronco",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesPosterioresPajarosTumbadoSobreCodosElevandoTronco.png",
      },
      {
        exercise: "Elevaciones posteriores tumbado lateral",
        photo:
          "/images/exercises/HombrosYCuellos/ElevacionesPosterioresTumbadoLateral.png",
      },
      {
        exercise: "Extensiones de brazos rectos",
        photo: "/images/exercises/HombrosYCuellos/ExtensionDeBrazosRectos.png",
      },
      {
        exercise: "Extensiones de cabeza tumbado",
        photo:
          "/images/exercises/HombrosYCuellos/ExtensionesDeCabezaTumbado.png",
      },
      {
        exercise: "Flexiones de cabeza tumbado",
        photo: "/images/exercises/HombrosYCuellos/FlexionesDeCabezaTumbado.png",
      },
      {
        exercise: "Flexiones de hombro en banco  con codos bloqueados",
        photo:
          "/images/exercises/HombrosYCuellos/FlexionesDeHombroEnBancoConCodosBloqueados.png",
      },
      {
        exercise: "Fondos en vertical invertido",
        photo:
          "/images/exercises/HombrosYCuellos/FondosEnVerticalInvertido.png",
      },
      {
        exercise: "Giros de cabeza tumbado",
        photo: "/images/exercises/HombrosYCuellos/GirosDeCabezaTumbado.png",
      },
      {
        exercise: "Inclinaciones laterales de cabeza tumbado",
        photo:
          "/images/exercises/HombrosYCuellos/InclinacionesLateralesDeCabezaTumbado.png",
      },
      {
        exercise: "Pájaros a una mano en polea",
        photo: "/images/exercises/HombrosYCuellos/PajarosAUnaManoEnPolea.png",
      },
      {
        exercise: "Pájaros a una mano en polea de rodillas",
        photo:
          "/images/exercises/HombrosYCuellos/PajarosAUnaManoEnPoleaDeRodillas.png",
      },
      {
        exercise:
          "Pájaros a una mano, extensiones con codo recto en polea baja",
        photo:
          "/images/exercises/HombrosYCuellos/PajarosAUnaManoExtensionesConCodoRectoEnPoleaBaja.png",
      },
      {
        exercise: "Pájaro sentado en contractor con los codos",
        photo:
          "/images/exercises/HombrosYCuellos/PajaroSentadoEnContractorConLosCodos.png",
      },
      {
        exercise: "Pájaro sentado en máquina horizontal",
        photo:
          "/images/exercises/HombrosYCuellos/PajaroSentadoEnMaquinaHorizontal.png",
      },
      {
        exercise: "Press con mancuernas",
        photo: "/images/exercises/HombrosYCuellos/PressConMancuernas.png",
      },
      {
        exercise: "Press con mancuernas a una mano",
        photo:
          "/images/exercises/HombrosYCuellos/PressConMancuernasAUnaMano.png",
      },
      {
        exercise: "Press con mancuernas con parada arriba",
        photo:
          "/images/exercises/HombrosYCuellos/PressConMancuernasConParadaArriba.png",
      },
      {
        exercise: "Press con mancuernas de pie",
        photo: "/images/exercises/HombrosYCuellos/PressConMancuernasDePie.png",
      },
      {
        exercise: "Press con mancuernas, palmas enfrentadas",
        photo:
          "/images/exercises/HombrosYCuellos/PressConMancuernasPalmasEnfrentadas.png",
      },
      {
        exercise: "Press con mancuernas tipo w",
        photo: "/images/exercises/HombrosYCuellos/PressConMancuernasTipoW.png",
      },
      {
        exercise: "Press en máquina",
        photo: "/images/exercises/HombrosYCuellos/PressEnMaquina.png",
      },
      {
        exercise: "Press frontal con mancuernas",
        photo:
          "/images/exercises/HombrosYCuellos/PressFrontalConMancuernas.png",
      },
      {
        exercise: "Press frontal con mancuernas con giro/press Arnold/Scott",
        photo:
          "/images/exercises/HombrosYCuellos/PressFrontalConMancuernasConGiroPressArnoldScott.png",
      },
      {
        exercise: "Press frontal con mancuernas, banco inclinado",
        photo:
          "/images/exercises/HombrosYCuellos/PressFrontalConMancuernasBancoInclinado.png",
      },
      {
        exercise: "Press frontal/Militar en multipower",
        photo:
          "/images/exercises/HombrosYCuellos/PressFrontalMilitarEnMultipower.png",
      },
      {
        exercise:
          "Press frontal/Militar en multipower, agarre estrecho y codos al frente",
        photo:
          "/images/exercises/HombrosYCuellos/PressFrontalMilitarEnMultipowerAgarreEstrechoYCodosAlFrente.png",
      },
      {
        exercise: "Press frontal/Militar en multipower tras nuca",
        photo:
          "/images/exercises/HombrosYCuellos/PressFrontalMilitarEnMultipowerTrasNuca.png",
      },
      {
        exercise: "Press militar/Frontal con barra",
        photo:
          "/images/exercises/HombrosYCuellos/PressMilitarFrontalConBarra.png",
      },
      {
        exercise:
          "Press militar/Frontal con barra, agarre estrecho y codos al frente",
        photo:
          "/images/exercises/HombrosYCuellos/PressMilitarFrontalConBarraAgarreEstrechoYCodosAlFrente.png",
      },
      {
        exercise: "Press sentado entre poleas bajas",
        photo:
          "/images/exercises/HombrosYCuellos/PressSentadoEntrePoleasBajas.png",
      },
      {
        exercise: "Remo al cuello con barra",
        photo: "/images/exercises/HombrosYCuellos/RemoAlCuelloConBarra.png",
      },
      {
        exercise: "Remo al cuello con barra, tronco flexionado",
        photo:
          "/images/exercises/HombrosYCuellos/RemoAlCuelloConBarraTroncoFlexionado.png",
      },
      {
        exercise: "Remo al cuello con barra y extensión al frente",
        photo:
          "/images/exercises/HombrosYCuellos/RemoAlCuelloConBarraYExtensionAlFrente.png",
      },
      {
        exercise: "Remo al cuello con mancuernas",
        photo:
          "/images/exercises/HombrosYCuellos/RemoAlCuelloConMancuernas.png",
      },
      {
        exercise: "Remo al cuello en multipower",
        photo: "/images/exercises/HombrosYCuellos/RemoAlCuelloEnMultipower.png",
      },
      {
        exercise: "Remo al cuello en polea baja",
        photo: "/images/exercises/HombrosYCuellos/RemoAlCuelloEnPoleaBaja.png",
      },
      {
        exercise: "Remo al cuello en polea baja tumbado",
        photo:
          "/images/exercises/HombrosYCuellos/RemoAlCuelloEnPoleaBajaTumbado.png",
      },
      {
        exercise: "Rotaciones externas en polea",
        photo:
          "/images/exercises/HombrosYCuellos/RotacionesExternasEnPolea.png",
      },
      {
        exercise: "Rotaciones externas tumbado",
        photo:
          "/images/exercises/HombrosYCuellos/RotacionesExternasTumbado.png",
      },
      {
        exercise: "Rotaciones internas en polea",
        photo:
          "/images/exercises/HombrosYCuellos/RotacionesInternasEnPolea.png",
      },
      {
        exercise: "Rotaciones internas tumbado",
        photo:
          "/images/exercises/HombrosYCuellos/RotacionesInternasTumbado.png",
      },
    ],
    Pectorales: [
      {
        exercise: "Aperturas/Aberturas con mancuernas",
        photo:
          "/images/exercises/Pectorales/AperturasAberturasConMancuernas.png",
      },
      {
        exercise: "Aperturas/Aberturas con mancuernas cruzando",
        photo:
          "/images/exercises/Pectorales/AperturasAberturasConMancuernasCruzando.png",
      },
      {
        exercise: "Aperturas/Aberturas con mancuernas declinadas",
        photo:
          "/images/exercises/Pectorales/AperturasAberturasConMancuernasDeclinadas.png",
      },
      {
        exercise: "Aperturas/Aberturas con mancuernas inclinadas",
        photo:
          "/images/exercises/Pectorales/AperturasAberturasConMancuernasInclinadas.png",
      },
      {
        exercise: "Aperturas en poleas bajas",
        photo: "/images/exercises/Pectorales/AperturasEnPoleasBajas.png",
      },
      {
        exercise: "Aperturas en poleas bajas a una mano",
        photo:
          "/images/exercises/Pectorales/AperturasEnPoleasBajasAUnaMano.png",
      },
      {
        exercise: "Aperturas en poleas bajas inclinado",
        photo:
          "/images/exercises/Pectorales/AperturasEnPoleasBajasInclinado.png",
      },
      {
        exercise: "Aperturas en poleas bajas tipo press",
        photo:
          "/images/exercises/Pectorales/AperturasEnPoleasBajasTipoPress.png",
      },
      {
        exercise: "Contractor",
        photo: "/images/exercises/Pectorales/Contractor.png",
      },
      {
        exercise: "Contractor, brazos abiertos",
        photo: "/images/exercises/Pectorales/ContractorBrazosAbiertos.png",
      },
      {
        exercise: "Contractor, solo movimiento final",
        photo: "/images/exercises/Pectorales/ContractorSoloMovimientoFinal.png",
      },
      {
        exercise: "Cruce de poleas",
        photo: "/images/exercises/Pectorales/CruceDePoleas.png",
      },
      {
        exercise: "Cruce de poleas a una mano",
        photo: "/images/exercises/Pectorales/CruceDePoleasAUnaMano.png",
      },
      {
        exercise: "Cruce de poleas a una mano en polea baja",
        photo:
          "/images/exercises/Pectorales/CruceDePoleasAUnaManoEnPoleaBaja.png",
      },
      {
        exercise: "Cruce de poleas tipo press",
        photo: "/images/exercises/Pectorales/CruceDePoleasTipoPress.png",
      },
      {
        exercise: "Elevaciones de barra lateral a una mano",
        photo:
          "/images/exercises/Pectorales/ElevacionesDeBarraLateralAUnaMano.png",
      },
      {
        exercise: "Fondos en el suelo",
        photo: "/images/exercises/Pectorales/FondosEnElSuelo.png",
      },
      {
        exercise: "Fondos en el suelo con codos rectos",
        photo: "/images/exercises/Pectorales/FondosEnElSueloConCodosRectos.png",
      },
      {
        exercise: "Fondos en el suelo, manos en alto",
        photo: "/images/exercises/Pectorales/FondosEnElSueloManosEnAlto.png",
      },
      {
        exercise: "Fondos en el suelo, pies en alto",
        photo: "/images/exercises/Pectorales/FondosEnElSueloPiesEnAlto.png",
      },
      {
        exercise: "Fondos en la pared",
        photo: "/images/exercises/Pectorales/FondosEnLaPared.png",
      },
      {
        exercise: "Fondos en paralelas",
        photo: "/images/exercises/Pectorales/FondosEnParalelas.png",
      },
      {
        exercise: "Fondos en paralelas con ayuda",
        photo: "/images/exercises/Pectorales/FondosEnParalelasConAyuda.png",
      },
      {
        exercise: "Fondos en paralelas con lastre",
        photo: "/images/exercises/Pectorales/FondosEnParalelasConLastre.png",
      },
      {
        exercise: "Fondos en paralelas, cuerpo recto",
        photo: "/images/exercises/Pectorales/FondosEnParalelasCuerpoRecto.png",
      },
      {
        exercise: "Fondos rodando con mancuernas",
        photo: "/images/exercises/Pectorales/FondosRodandoConMancuernas.png",
      },
      {
        exercise: "Giros con mancuernas",
        photo: "/images/exercises/Pectorales/GirosConMancuernas.png",
      },
      {
        exercise: "Press con mancuernas",
        photo: "/images/exercises/Pectorales/PressConMancuernas.png",
      },
      {
        exercise: "Press con mancuernas con giro hacia fuera",
        photo:
          "/images/exercises/Pectorales/PressConMancuernasConGiroHaciaFuera.png",
      },
      {
        exercise: "Press con mancuernas con palmas enfrentadas",
        photo:
          "/images/exercises/Pectorales/PressConMancuernasConPalmasEnfrentadas.png",
      },
      {
        exercise: "Press de banca",
        photo: "/images/exercises/Pectorales/PressDeBanca.png",
      },
      {
        exercise: "Press de banca con codos rectos",
        photo: "/images/exercises/Pectorales/PressDeBancaConCodosRectos.png",
      },
      {
        exercise: "Press de banca declinado",
        photo: "/images/exercises/Pectorales/PressDeBancaDeclinado.png",
      },
      {
        exercise: "Press de banca declinado con mancuernas",
        photo:
          "/images/exercises/Pectorales/PressDeBancaDeclinadoConMancuernas.png",
      },
      {
        exercise: "Press de banca declinado con mancuernas y giro hacia fuera",
        photo:
          "/images/exercises/Pectorales/PressDeBancaDeclinadoConMancuernasYGiroHaciaFuera.png",
      },
      {
        exercise: "Press de banca en máquina",
        photo: "/images/exercises/Pectorales/PressDeBancaEnMaquina.png",
      },
      {
        exercise: "Press de banca en máquina declinado",
        photo:
          "/images/exercises/Pectorales/PressDeBancaEnMaquinaDeclinado.png",
      },
      {
        exercise: "Press de banca en máquina inclinado",
        photo:
          "/images/exercises/Pectorales/PressDeBancaEnMaquinaInclinado.png",
      },
      {
        exercise: "Press de banca en máquina sentado/vertical",
        photo:
          "/images/exercises/Pectorales/PressDeBancaEnMaquinaSentadoVertical.png",
      },
      {
        exercise: "Press de banca en multipower",
        photo: "/images/exercises/Pectorales/PressDeBancaEnMultipower.png",
      },
      {
        exercise: "Press de banca en multipower, codos rectos",
        photo:
          "/images/exercises/Pectorales/PressDeBancaEnMultipowerCodosRectos.png",
      },
      {
        exercise: "Press de banca en multipower declinado",
        photo:
          "/images/exercises/Pectorales/PressDeBancaEnMultipowerDeclinado.png",
      },
      {
        exercise: "Press de banca en multipower inclinado",
        photo:
          "/images/exercises/Pectorales/PressDeBancaEnMultipowerInclinado.png",
      },
      {
        exercise: "Press de banca inclinado",
        photo: "/images/exercises/Pectorales/PressDeBancaInclinado.png",
      },
      {
        exercise: "Press de banca inclinado con mancuernas",
        photo:
          "/images/exercises/Pectorales/PressDeBancaInclinadoConMancuernas.png",
      },
      {
        exercise: "Press de banca inclinado con mancuernas y giro hacia fuera",
        photo:
          "/images/exercises/Pectorales/PressDeBancaInclinadoConMancuernasYGiroHaciaFuera.png",
      },
      {
        exercise: "Press de banca, manos juntas/agarre cerrado",
        photo:
          "/images/exercises/Pectorales/PressDeBancaManosJuntasAgarreCerrado.png",
      },
      {
        exercise: "Press de banca, manos juntas y codos pegados",
        photo:
          "/images/exercises/Pectorales/PressDeBancaManosJuntasYCodosPegados.png",
      },
      {
        exercise: "Press de banca, manos separadas/agarre abierto",
        photo:
          "/images/exercises/Pectorales/PressDeBancaManosSeparadasAgarreAbierto.png",
      },
      {
        exercise: "Pull over con barra",
        photo: "/images/exercises/Pectorales/PullOverConBarra.png",
      },
      {
        exercise: "Pull over con mancuerna",
        photo: "/images/exercises/Pectorales/PullOverConMancuerna.png",
      },
      {
        exercise: "Pull over con mancuerna a dos manos alterno",
        photo:
          "/images/exercises/Pectorales/PullOverConMancuernaADosManosAlterno.png",
      },
      {
        exercise: "Pull over con mancuerna, banco cruzado",
        photo:
          "/images/exercises/Pectorales/PullOverConMancuernaBancoCruzado.png",
      },
      {
        exercise: "Pull over en polea baja",
        photo: "/images/exercises/Pectorales/PullOverEnPoleaBaja.png",
      },
      {
        exercise: "Pull over sobre mancuernas en el suelo",
        photo:
          "/images/exercises/Pectorales/PullOverSobreMancuernasEnElSuelo.png",
      },
    ],
    Piernas: [
      {
        exercise: "Aducción de cadera tumbado",
        photo: "/images/exercises/Piernas/AduccionDeCaderaTumbado.png",
      },
      {
        exercise: "Aductores de pie/Aducción de cadera",
        photo: "/images/exercises/Piernas/AductoresDePieAduccionDeCadera.png",
      },
      {
        exercise: "Aductores de pie/Aducción de cadera tumbado",
        photo:
          "/images/exercises/Piernas/AductoresDePieAduccionDeCaderaTumbado.png",
      },
      {
        exercise:
          "Aductores de pie/Aducción de cadera tumbado abriendo en tijera",
        photo:
          "/images/exercises/Piernas/AductoresDePieAduccionDeCaderaTumbadoAbriendoEnTijera.png",
      },
      {
        exercise: "Aductores en multipolea",
        photo: "/images/exercises/Piernas/AductoresEnMultipolea.png",
      },
      {
        exercise: "Aductores en polea baja",
        photo: "/images/exercises/Piernas/AductoresEnPoleaBaja.png",
      },
      {
        exercise: "Aductores en polea baja tumbado",
        photo: "/images/exercises/Piernas/AductoresEnPoleaBajaTumbado.png",
      },
      {
        exercise: "Aductores sentado",
        photo: "/images/exercises/Piernas/AductoresSentado.png",
      },
      {
        exercise: "Aductores sentado, respaldo inclinado",
        photo:
          "/images/exercises/Piernas/AductoresSentadoRespaldoInclinado.png",
      },
      {
        exercise: "Curl/Flexiones para femoral de pie a una pierna",
        photo:
          "/images/exercises/Piernas/CurlFlexionesParaFemoralDePieAUnaPierna.png",
      },
      {
        exercise: "Curl/Flexiones para femoral sentado",
        photo: "/images/exercises/Piernas/CurlFlexionesParaFemoralSentado.png",
      },
      {
        exercise: "Curl/Flexiones para femoral tumbado",
        photo: "/images/exercises/Piernas/CurlFlexionesParaFemoralTumbado.png",
      },
      {
        exercise: "Curl/Flexiones para femoral tumbado a una pierna",
        photo:
          "/images/exercises/Piernas/CurlFlexionesParaFemoralTumbadoAUnaPierna.png",
      },
      {
        exercise: "Curl/Flexiones para femoral tumbado, puntas hacia dentro",
        photo:
          "/images/exercises/Piernas/CurlFlexionesParaFemoralTumbadoPuntasHaciaDentro.png",
      },
      {
        exercise: "Curl/Flexiones para femoral tumbado, puntas hacia fuera",
        photo:
          "/images/exercises/Piernas/CurlFlexionesParaFemoralTumbadoPuntasHaciaFuera.png",
      },
      {
        exercise: "Elevaciones de cadera tumbado",
        photo: "/images/exercises/Piernas/ElevacionesDeCaderaTumbado.png",
      },
      {
        exercise: "Elevaciones de pierna laterales/Abducción de cadera",
        photo:
          "/images/exercises/Piernas/ElevacionesDePiernaLateralesAbduccionDeCadera.png",
      },
      {
        exercise: "Elevaciones de pierna laterales/Abducción de cadera tumbado",
        photo:
          "/images/exercises/Piernas/ElevacionesDePiernaLateralesAbduccionDeCaderaTumbado.png",
      },
      {
        exercise:
          "Elevaciones de pierna laterales/Abducción de cadera tumbado y rodilla flexionada",
        photo:
          "/images/exercises/Piernas/ElevacionesDePiernaLateralesAbduccionDeCaderaTumbadoYRodillaFlexionada.png",
      },
      {
        exercise: "Elevaciones de talones",
        photo: "/images/exercises/Piernas/ElevacionesDeTalones.png",
      },
      {
        exercise: "Elevaciones de talones a un pie",
        photo: "/images/exercises/Piernas/ElevacionesDeTalonesAUnPie.png",
      },
      {
        exercise: "Elevaciones de talones con lastre",
        photo: "/images/exercises/Piernas/ElevacionesDeTalonesConLastre.png",
      },
      {
        exercise: "Elevaciones de talones en máquina",
        photo: "/images/exercises/Piernas/ElevacionesDeTalonesEnMaquina.png",
      },
      {
        exercise: "Elevaciones de talones en máquina, puntas hacia dentro",
        photo:
          "/images/exercises/Piernas/ElevacionesDeTalonesEnMaquinaPuntasHaciaDentro.png",
      },
      {
        exercise: "Elevaciones de talones en máquina, puntas hacia fuera",
        photo:
          "/images/exercises/Piernas/ElevacionesDeTalonesEnMaquinaPuntasHaciaFuera.png",
      },
      {
        exercise: "Elevaciones de talones en máquina, tipo burro",
        photo:
          "/images/exercises/Piernas/ElevacionesDeTalonesEnMaquinaBurro.png",
      },
      {
        exercise: "Elevaciones de talones en polea baja",
        photo: "/images/exercises/Piernas/ElevacionesDeTalonesEnPoleaBaja.png",
      },
      {
        exercise: "Elevaciones de talones sentado",
        photo: "/images/exercises/Piernas/ElevacionesDeTalonesSentado.png",
      },
      {
        exercise: "Elevaciones de talones sentado con barra",
        photo:
          "/images/exercises/Piernas/ElevacionesDeTalonesSentadoConBarra.png",
      },
      {
        exercise: "Elevaciones de talones sentado con mancuernas",
        photo:
          "/images/exercises/Piernas/ElevacionesDeTalonesSentadoConMancuernas.png",
      },
      {
        exercise: "Elevaciones de talones sentado con mancuernas a un pie",
        photo:
          "/images/exercises/Piernas/ElevacionesDeTalonesSentadoConMancuernasAUnPie.png",
      },
      {
        exercise: "Elevaciones de talones tipo 'burro'",
        photo: "/images/exercises/Piernas/ElevacionesDeTalonesTipoBurro.png",
      },
      {
        exercise: "Escalón",
        photo: "/images/exercises/Piernas/Escalon.png",
      },
      {
        exercise: "Escalón lateral",
        photo: "/images/exercises/Piernas/EscalonLateral.png",
      },
      {
        exercise: "Escalón pasando al otro lado",
        photo: "/images/exercises/Piernas/EscalonPasandoAlOtroLado.png",
      },
      {
        exercise: "Extensiones para cuádriceps/de rodilla",
        photo:
          "/images/exercises/Piernas/ExtensionesParaCuadricepsDeRodilla.png",
      },
      {
        exercise: "Extensiones para cuádriceps/de rodilla a una pierna",
        photo:
          "/images/exercises/Piernas/ExtensionesParaCuadricepsDeRodillaAUnaPierna.png",
      },
      {
        exercise: "Extensiones para cuádriceps/de rodilla, puntas hacia dentro",
        photo:
          "/images/exercises/Piernas/ExtensionesParaCuadricepsDeRodillaPuntasHaciaDentro.png",
      },
      {
        exercise: "Extensiones para cuádriceps/de rodilla, puntas hacia fuera",
        photo:
          "/images/exercises/Piernas/ExtensionesParaCuadricepsDeRodillaPuntasHaciaFuera.png",
      },
      {
        exercise: "Extensiones para cuádriceps en polea baja",
        photo:
          "/images/exercises/Piernas/ExtensionesParaCuadricepsEnPoleaBaja.png",
      },
      {
        exercise: "Flexiones de cadera en multipolea",
        photo: "/images/exercises/Piernas/FlexionesDeCaderaEnMultipolea.png",
      },
      {
        exercise: "Flexiones de cadera en polea",
        photo: "/images/exercises/Piernas/FlexionesDeCaderaEnPolea.png",
      },
      {
        exercise: "Flexiones de cadera en polea baja tumbado",
        photo:
          "/images/exercises/Piernas/FlexionesDeCaderaEnPoleaBajaTumbado.png",
      },
      {
        exercise: "Flexiones dorsales/Extensiones del pie con disco",
        photo:
          "/images/exercises/Piernas/FlexionesDorsalesExtensionesDelPieConDisco.png",
      },
      {
        exercise: "Flexiones para femoral en polea baja",
        photo: "/images/exercises/Piernas/FlexionesParaFemoralEnPoleaBaja.png",
      },
      {
        exercise: "Flexiones tibiales de pie en polea sentado",
        photo:
          "/images/exercises/Piernas/FlexionesTibialesDePieEnPoleaSentado.png",
      },
      {
        exercise: "Gemelos en prensa",
        photo: "/images/exercises/Piernas/GemelosEnPrensa.png",
      },
      {
        exercise: "Gemelos en prensa horizontal",
        photo: "/images/exercises/Piernas/GemelosEnPrensaHorizontal.png",
      },
      {
        exercise: "Gemelos en prensa, rodillas flexionadas",
        photo:
          "/images/exercises/Piernas/GemelosEnPrensaRodillasFlexionadas.png",
      },
      {
        exercise: "Glúteos en multipolea",
        photo: "/images/exercises/Piernas/GluteosEnMultipolea.png",
      },
      {
        exercise: "Glúteos en multipolea tumbado y ambas piernas a la vez",
        photo:
          "/images/exercises/Piernas/GluteosEnMultipoleaTumbadoYAmbasPiernasALaVez.png",
      },
      {
        exercise: "Glúteos en polea baja",
        photo: "/images/exercises/Piernas/GluteosEnPoleaBaja.png",
      },
      {
        exercise: "Glúteos, patada de glúteo en máquina",
        photo: "/images/exercises/Piernas/GluteosPatadaDeGluteoEnMaquina.png",
      },
      {
        exercise: "Músculos abductores en multipolea",
        photo: "/images/exercises/Piernas/MusculosAbductoresEnMultipolea.png",
      },
      {
        exercise: "Músculos abductores en polea baja",
        photo: "/images/exercises/Piernas/MusculosAbductoresEnPoleaBaja.png",
      },
      {
        exercise: "Músculos abductores sentado",
        photo: "/images/exercises/Piernas/MusculosAbductoresSentado.png",
      },
      {
        exercise: "Patadas de gluteo",
        photo: "/images/exercises/Piernas/PatadasDeGluteo.png",
      },
      {
        exercise: "Patadas de gluteo, elevaciones de cadera tumbado",
        photo:
          "/images/exercises/Piernas/PatadasDeGluteoElevacionesDeCaderaTumbado.png",
      },
      {
        exercise: "Patadas de gluteo sobre un banco simultáneo a dos piernas",
        photo:
          "/images/exercises/Piernas/PatadasDeGluteoSobreUnBancoSimultaneoADosPiernas.png",
      },
      {
        exercise: "Patadas de gluteo sólo movimiento final",
        photo:
          "/images/exercises/Piernas/PatadasDeGluteoSoloMovimientoFinal.png",
      },
      {
        exercise: "Peso muerto",
        photo: "/images/exercises/Piernas/PesoMuerto.png",
      },
      {
        exercise: "Peso muerto buenos días",
        photo: "/images/exercises/Piernas/PesoMuertoBuenosDias.png",
      },
      {
        exercise: "Peso muerto con mancuernas",
        photo: "/images/exercises/Piernas/PesoMuertoConMancuernas.png",
      },
      {
        exercise: "Peso muerto flexiones femorales en banco abdominal",
        photo:
          "/images/exercises/Piernas/PesoMuertoFlexionesFemoralesEnBancoAbdominal.png",
      },
      {
        exercise: "Prensa/Press de piernas",
        photo: "/images/exercises/Piernas/PrensaPressDePiernas.png",
      },
      {
        exercise: "Prensa/Press de piernas Jaca/hack",
        photo: "/images/exercises/Piernas/PrensaPressDePiernasJacaHack.png",
      },
      {
        exercise: "Prensa/Press de piernas, pies abajo",
        photo: "/images/exercises/Piernas/PrensaPressDePiernasPiesAbajo.png",
      },
      {
        exercise: "Prensa/Press de piernas, pies arriba",
        photo: "/images/exercises/Piernas/PrensaPressDePiernasPiesArriba.png",
      },
      {
        exercise: "Prensa/Press de piernas vertical/atlética",
        photo:
          "/images/exercises/Piernas/PrensaPressDePiernasVerticalAtletica.png",
      },
      {
        exercise:
          "Rotaciones externas de rodilla en polea sentado y rotación de cadera",
        photo:
          "/images/exercises/Piernas/RotacionesExternasDeRodillaEnPoleaSentadoYRotacionDeCadera.png",
      },
      {
        exercise:
          "Rotaciones internas de rodilla en polea sentado y rotación de cadera",
        photo:
          "/images/exercises/Piernas/RotacionesInternasDeRodillaEnPoleaSentadoYRotacionDeCadera.png",
      },
      {
        exercise: "Sentadilla",
        photo: "/images/exercises/Piernas/Sentadilla.png",
      },
      {
        exercise: "Sentadilla a una pierna/rumana",
        photo: "/images/exercises/Piernas/SentadillaRumana.png",
      },
      {
        exercise: "Sentadilla con mancuernas",
        photo: "/images/exercises/Piernas/SentadillaConMancuernas.png",
      },
      {
        exercise: "Sentadilla en máquina",
        photo: "/images/exercises/Piernas/SentadillaEnMaquina.png",
      },
      {
        exercise: "Sentadilla en multipower frontal",
        photo: "/images/exercises/Piernas/SentadillaEnMultipowerFrontal.png",
      },
      {
        exercise: "Sentadilla en multipower y pies adelantados",
        photo:
          "/images/exercises/Piernas/SentadillaEnMultipowerYPiesAdelantados.png",
      },
      {
        exercise: "Sentadilla en multipower y pies atrasados",
        photo:
          "/images/exercises/Piernas/SentadillaEnMultipowerYPiesAtrasados.png",
      },
      {
        exercise: "Sentadilla, frontal",
        photo: "/images/exercises/Piernas/SentadillaFrontal.png",
      },
      {
        exercise: "Sentadilla, piernas separadas",
        photo: "/images/exercises/Piernas/SentadillaPiernasSeparadas.png",
      },
      {
        exercise: "Sentadilla por detras/Hack con barra",
        photo: "/images/exercises/Piernas/SentadillaPorDetrasHackConBarra.png",
      },
      {
        exercise: "Sentadilla Sissy",
        photo: "/images/exercises/Piernas/SentadillaSissy.png",
      },
      {
        exercise: "Tijeras en multipower",
        photo: "/images/exercises/Piernas/TijerasEnMultipower.png",
      },
      {
        exercise: "Zancadas/Tijeras",
        photo: "/images/exercises/Piernas/ZancadasTijeras.png",
      },
      {
        exercise: "Zancadas/Tijeras avanzando",
        photo: "/images/exercises/Piernas/ZancadasTijerasAvanzando.png",
      },
      {
        exercise: "Zancadas/Tijeras lateral",
        photo: "/images/exercises/Piernas/ZancadasTijerasLateral.png",
      },
    ],
    Triceps: [
      {
        exercise: "Extensiones con barra por encima de la cabeza",
        photo:
          "/images/exercises/Triceps/ExtensionesConBarraPorEncimaDeLaCabeza.png",
      },
      {
        exercise: "Extensiones con dos mancuernas por encima de la cabeza",
        photo:
          "/images/exercises/Triceps/ExtensionesConDosMancuernasPorEncimaDeLaCabeza.png",
      },
      {
        exercise:
          "Extensiones de mancuerna a dos manos por encima de la cabeza",
        photo:
          "/images/exercises/Triceps/ExtensionesDeMancuernaADosManosPorEncimaDeLaCabeza.png",
      },
      {
        exercise:
          "Extensiones de mancuerna con una mano por encima de la cabeza",
        photo:
          "/images/exercises/Triceps/ExtensionesDeMancuernaConUnaManoPorEncimaDeLaCabeza.png",
      },
      {
        exercise: "Extensiones en máquina",
        photo: "/images/exercises/Triceps/ExtensionesEnMaquina.png",
      },
      {
        exercise: "Extensiones en polea",
        photo: "/images/exercises/Triceps/ExtensionesEnPolea.png",
      },
      {
        exercise: "Extensiones en polea a dos manos invertido/supinado",
        photo:
          "/images/exercises/Triceps/ExtensionesEnPoleaADosManosInvertidoSupinado.png",
      },
      {
        exercise: "Extensiones en polea a una mano",
        photo: "/images/exercises/Triceps/ExtensionesEnPoleaAUnaMano.png",
      },
      {
        exercise: "Extensiones en polea a una mano invertido/supinada",
        photo:
          "/images/exercises/Triceps/ExtensionesEnPoleaAUnaManoInvertidoSupinada.png",
      },
      {
        exercise: "Extensiones en polea a una mano y agarre neutro/martillo",
        photo:
          "/images/exercises/Triceps/ExtensionesEnPoleaAUnaManoYAgarreNeutroMartillo.png",
      },
      {
        exercise: "Extensiones en polea con cuerda",
        photo: "/images/exercises/Triceps/ExtensionesEnPoleaConCuerda.png",
      },
      {
        exercise:
          "Extensiones en polea con cuerda a una mano por encima de la cabeza",
        photo:
          "/images/exercises/Triceps/ExtensionesEnPoleaConCuerdaAUnaManoPorEncimaDeLaCabeza.png",
      },
      {
        exercise: "Extensiones en polea con cuerda por encima de la cabeza",
        photo:
          "/images/exercises/Triceps/ExtensionesEnPoleaConCuerdaPorEncimaDeLaCabeza.png",
      },
      {
        exercise: "Extensiones en polea de espaldas",
        photo: "/images/exercises/Triceps/ExtensionesEnPoleaDeEspaldas.png",
      },
      {
        exercise: "Extensiones triceps, patadas en polea baja con cuerda",
        photo:
          "/images/exercises/Triceps/ExtensionesTricepsPatadasEnPoleaBaja.png",
      },
      {
        exercise: "Extensiones tumbado a una mano en polea baja",
        photo:
          "/images/exercises/Triceps/ExtensionesTumbadoAUnaManoEnPoleBaja.png",
      },
      {
        exercise: "Fondos con ayuda",
        photo: "/images/exercises/Triceps/FondosConAyuda.png",
      },
      {
        exercise: "Fondos en el suelo",
        photo: "/images/exercises/Triceps/FondosEnElSuelo.png",
      },
      {
        exercise: "Fondos en el suelo a una mano",
        photo: "/images/exercises/Triceps/FondosEnElSueloAUnaMano.png",
      },
      {
        exercise: "Fondos en el suelo, palmas una sobre otra",
        photo:
          "/images/exercises/Triceps/FondosEnElSueloPalmasUnaSobreOtra.png",
      },
      {
        exercise: "Fondos en paralelas",
        photo: "/images/exercises/Triceps/FondosEnParalelas.png",
      },
      {
        exercise: "Fondos en un banco",
        photo: "/images/exercises/Triceps/FondosEnUnBanco.png",
      },
      {
        exercise: "Fondos entre bancos",
        photo: "/images/exercises/Triceps/FondosEntreBancos.png",
      },
      {
        exercise: "Fondos entre bancos con lastre",
        photo: "/images/exercises/Triceps/FondosEntreBancosConLastre.png",
      },
      {
        exercise: "Fondos sobre una pared",
        photo: "/images/exercises/Triceps/FondosSobreUnaPared.png",
      },
      {
        exercise: "Patadas con mancuerna",
        photo: "/images/exercises/Triceps/PatadasConMancuerna.png",
      },
      {
        exercise: "Patadas con mancuerna con giro",
        photo: "/images/exercises/Triceps/PatadasConMancuernaConGiro.png",
      },
      {
        exercise: "Patadas con mancuerna en pronación",
        photo: "/images/exercises/Triceps/PatadasConMancuernaEnPronacion.png",
      },
      {
        exercise: "Patadas con mancuerna en supinación",
        photo: "/images/exercises/Triceps/PatadasConMancuernaEnSupinacion.png",
      },
      {
        exercise: "Patadas con mancuerna simultáneo a dos manos",
        photo:
          "/images/exercises/Triceps/PatadasConMancuernaSimultaneoADosManos.png",
      },
      {
        exercise: "Press de banca con agarre estrecho/cerrado",
        photo:
          "/images/exercises/Triceps/PressDeBancaConAgarreEstrechoCerrado.png",
      },
      {
        exercise: "Press de banca con agarre estrecho/cerrado abriendo codos",
        photo:
          "/images/exercises/Triceps/PressDeBancaConAgarreEstrechoCerradoAbriendoCodos.png",
      },
      {
        exercise: "Press de banca con agarre medio",
        photo: "/images/exercises/Triceps/PressDeBancaConAgarreMedio.png",
      },
      {
        exercise: "Press en máquina horizontal/sentado",
        photo: "/images/exercises/Triceps/PressEnMaquinaHorizontalSentado.png",
      },
      {
        exercise: "Press estrecho/cerrado en multipower",
        photo: "/images/exercises/Triceps/PressEstrechoCerradoEnMultipower.png",
      },
      {
        exercise:
          "Press francés con mancuernas/Extensiones con mancuernas tumbado",
        photo:
          "/images/exercises/Triceps/PressFrancesConMancuernasExtensionesConMancuernasTumbado.png",
      },
      {
        exercise:
          "Press francés con mancuernas/Extensiones con mancuernas tumbado a una mano al hombro contrario",
        photo:
          "/images/exercises/Triceps/PressFrancesConMancuernasExtensionesConMancuernasTumbadoAUnaManoAlHombroContrario.png",
      },
      {
        exercise:
          "Press francés con mancuernas/Extensiones con mancuernas tumbado a una mano al propio hombro",
        photo:
          "/images/exercises/Triceps/PressFrancesConMancuernasExtensionesConMancuernasTumbadoAUnaManoAlPropioHombro.png",
      },
      {
        exercise:
          "Press francés con mancuernas/Extensiones con mancuernas tumbado a una mano de lado",
        photo:
          "/images/exercises/Triceps/PressFrancesConMancuernasExtensionesConMancuernasTumbadoAUnaManoDeLado.png",
      },
      {
        exercise: "Press francés en polea",
        photo: "/images/exercises/Triceps/PressFrancesEnPolea.png",
      },
      {
        exercise: "Press francés/Extensiones con barra",
        photo: "/images/exercises/Triceps/PressFrancesExtensionesConBarra.png",
      },
      {
        exercise: "Press francés/Extensiones con barra, agarre invertido",
        photo:
          "/images/exercises/Triceps/PressFrancesExtensionesConBarraAgarreInvertido.png",
      },
      {
        exercise:
          "Press francés/Extensiones con barra, bajando detrás de la cabeza",
        photo:
          "/images/exercises/Triceps/PressFrancesExtensionesConBarraBajandoDetrasDeLaCabeza.png",
      },
    ],
  } as ExercisesDataStructure,
}

export function getBodyZones(): string[] {
  return exercisesData.exercises.Zonas
}

export function getExercisesByZone(zone: string): Exercise[] {
  const zoneData = exercisesData.exercises[zone]

  if (Array.isArray(zoneData) && zone !== "Zonas") {
    return zoneData as Exercise[]
  }

  return []
}

export function getExercisePhotoUrl(
  zone: string,
  exerciseName: string,
): string | null {
  const exercises = getExercisesByZone(zone)
  const exercise = exercises.find((ex) => ex.exercise === exerciseName)

  return exercise?.photo || null
}

export function convertImagePath(path: string | null): string {
  if (!path) return "/placeholder.svg?height=200&width=200"
  return path.replace("/images/exercises/", "/images/exercises/")
}
