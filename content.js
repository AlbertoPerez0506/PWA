/* ============================================================
   CONTENIDO EDUCATIVO — Bio en Procesos (Etapa 1)
   Edita libremente este archivo sin tocar la interfaz.
   ============================================================ */

window.BIO_CONTENT = {
  capsules: [
    {
      id: 'c1',
      number: '01',
      title: 'Fundamentos',
      subtitle: 'Qué es Bio en Procesos y por qué se estudia.',
      icon: 'i-book',
      segments: [
        {
          kicker: 'Introducción',
          title: '¿Qué es Bio en Procesos?',
          illustration: 'flask',
          text:
            'Bio en Procesos es el nombre que damos al estudio de los procesos biológicos ' +
            'que la industria utiliza para transformar materiales. En lugar de recurrir solo ' +
            'a la química tradicional, se apoyan en organismos vivos, células o enzimas para ' +
            'obtener productos útiles: alimentos, medicamentos, biocombustibles y más.',
          keyConcept:
            'Un bioproceso es una transformación en la que un organismo vivo o una de sus ' +
            'partes hace el trabajo principal.',
          fact:
            'Muchos alimentos que consumimos a diario, como el yogur o el pan, son el ' +
            'resultado de bioprocesos que ocurren desde hace miles de años.'
        },
        {
          kicker: 'Definición y conceptos',
          title: 'Los conceptos que sostienen la idea',
          illustration: 'cells',
          text:
            'Detrás de cada bioproceso hay tres ideas básicas: el microorganismo o célula ' +
            'que realiza la transformación, el medio en el que vive y las condiciones que ' +
            'permiten que trabaje (temperatura, nutrientes, pH). Comprender estos conceptos ' +
            'es el primer paso para entender cualquier proceso biológico aplicado.',
          keyConcept:
            'Célula, medio de cultivo y condiciones controladas forman el triángulo básico ' +
            'de todo bioproceso.',
          fact:
            'Un cambio pequeño en la temperatura o el pH puede hacer que un microorganismo ' +
            'deje de producir lo que necesitamos.'
        },
        {
          kicker: 'Importancia del tema',
          title: '¿Por qué importa Bio en Procesos?',
          illustration: 'leaf',
          text:
            'Entender los bioprocesos permite producir bienes de forma más sostenible, ' +
            'reducir residuos y aprovechar recursos renovables. También es la base de ' +
            'industrias como la alimentaria, la farmacéutica y la energética. Por eso, ' +
            'aprender sus fundamentos abre la puerta a muchas aplicaciones reales.',
          keyConcept:
            'Los bioprocesos son una herramienta clave para producir de manera más limpia ' +
            'y eficiente.',
          fact:
            'La biotecnología industrial busca reemplazar procesos químicos por bioprocesos ' +
            'cuando es posible, para reducir el impacto ambiental.'
        }
      ],
      quiz: {
        question: '¿Cuál de estas frases describe mejor un bioproceso?',
        options: [
          'Un proceso químico que no involucra ningún ser vivo.',
          'Una transformación en la que un organismo vivo o sus componentes hacen el trabajo principal.',
          'Un proceso que solo se da en laboratorios farmacéuticos.'
        ],
        correct: 1,
        feedbackOk:
          'Un bioproceso se apoya en células, enzimas o microorganismos para transformar materiales.',
        feedbackKo:
          'Casi. La clave está en que un organismo vivo o una de sus partes realiza la transformación principal.'
      }
    },

    {
      id: 'c2',
      number: '02',
      title: 'Funcionamiento',
      subtitle: 'Elementos, características y etapas del proceso.',
      icon: 'i-cog',
      segments: [
        {
          kicker: 'Elementos que intervienen',
          title: 'Las piezas del proceso',
          illustration: 'gear',
          text:
            'En un bioproceso intervienen varios elementos: el microorganismo o célula ' +
            '(el «motor»), el medio de cultivo (su alimento), el biorreactor (el espacio ' +
            'donde ocurre) y los sistemas de control (temperatura, aireación, pH). Cada ' +
            'pieza cumple una función específica y todas deben coordinarse.',
          keyConcept:
            'El biorreactor es el espacio controlado donde el microorganismo trabaja y se multiplica.',
          fact:
            'Los biorreactores pueden ir desde frascos pequeños de laboratorio hasta ' +
            'tanques de miles de litros en la industria.'
        },
        {
          kicker: 'Características principales',
          title: 'Cómo se comporta un bioproceso',
          illustration: 'graph',
          text:
            'Los bioprocesos tienen características propias: son sensibles a las ' +
            'condiciones, requieren tiempos determinados y suelen generar subproductos. ' +
            'También pueden dividirse en etapas (por ejemplo, crecimiento del microorganismo ' +
            'y producción del compuesto de interés). Aprender a leer esas características ' +
            'es clave para controlarlos.',
          keyConcept:
            'Cada bioproceso tiene una curva de crecimiento y una fase de producción que conviene distinguir.',
          fact:
            'La fase de crecimiento del microorganismo suele ser distinta de la fase en ' +
            'la que genera el producto que buscamos.'
        },
        {
          kicker: 'Etapas del proceso',
          title: 'Del inicio al producto final',
          illustration: 'layers',
          text:
            'Un bioproceso típico avanza en etapas: preparación del medio, inoculación, ' +
            'crecimiento, producción, separación y purificación. Algunas etapas pueden ' +
            'repetirse o ajustarse según el producto. Entender este orden permite planificar ' +
            'mejor y detectar dónde puede fallar un proceso.',
          keyConcept:
            'Preparación, crecimiento, producción y purificación son las etapas generales ' +
            'de un bioproceso.',
          fact:
            'La etapa de purificación puede ser tan costosa como la producción misma, ' +
            'dependiendo del producto.'
        }
      ],
      quiz: {
        question: '¿Cuál es el papel del biorreactor en un bioproceso?',
        options: [
          'Almacenar el producto final sin modificarlo.',
          'Ofrecer un espacio controlado donde el microorganismo trabaja y se multiplica.',
          'Sustituir al microorganismo en la transformación.'
        ],
        correct: 1,
        feedbackOk:
          'El biorreactor mantiene las condiciones adecuadas para que el microorganismo realice su trabajo.',
        feedbackKo:
          'Recuerda: el biorreactor no sustituye al microorganismo, sino que le da un entorno controlado para trabajar.'
      }
    },

    {
      id: 'c3',
      number: '03',
      title: 'Aplicaciones',
      subtitle: 'Ejemplos, usos cotidianos y su importancia.',
      icon: 'i-leaf',
      segments: [
        {
          kicker: 'Ejemplos prácticos',
          title: 'Bioprocesos en acción',
          illustration: 'droplet',
          text:
            'Hay bioprocesos en muchos productos que usamos a diario: el yogur y el queso ' +
            '(fermentación láctica), el pan (fermentación por levaduras), algunos medicamentos ' +
            '(como la insulina) y los biocombustibles. En cada caso, un organismo vivo ' +
            'transforma un material en otro de mayor valor.',
          keyConcept:
            'La fermentación es uno de los bioprocesos más antiguos y sigue siendo fundamental hoy.',
          fact:
            'La insulina que usan muchas personas con diabetes se produce con bioprocesos ' +
            'en los que participan microorganismos modificados.'
        },
        {
          kicker: 'Aplicaciones cotidianas e industriales',
          title: 'Más allá de la cocina',
          illustration: 'factory',
          text:
            'Los bioprocesos se aplican en la industria alimentaria, la farmacéutica, la ' +
            'energética y la de materiales. También se usan para tratar aguas residuales o ' +
            'producir bioplásticos. Cada vez más sectores los adoptan porque permiten obtener ' +
            'productos con menor impacto ambiental.',
          keyConcept:
            'La industria aprovecha los bioprocesos para obtener productos variados con ' +
            'menor impacto ambiental.',
          fact:
            'Algunos bioplásticos se producen por fermentación de azúcares, sin usar ' +
            'petróleo como materia prima.'
        },
        {
          kicker: 'Importancia de lo aprendido',
          title: 'Por qué vale la pena conocerlos',
          illustration: 'cycle',
          text:
            'Comprender los bioprocesos permite tomar mejores decisiones como consumidores ' +
            'y como profesionales. También abre la puerta a carreras como biotecnología, ' +
            'ingeniería de procesos o ciencia de alimentos. Y sobre todo, ayuda a valorar ' +
            'cómo la biología puede resolver problemas reales.',
          keyConcept:
            'Conocer los bioprocesos conecta la biología con la vida diaria y con muchas ' +
            'salidas profesionales.',
          fact:
            'La biotecnología es una de las áreas con mayor crecimiento en empleo científico ' +
            'y técnico en las últimas décadas.'
        }
      ],
      quiz: {
        question: '¿Cuál de estos es un ejemplo de bioproceso?',
        options: [
          'La fabricación de yogur mediante fermentación.',
          'El diseño de un videojuego.',
          'La edición de una fotografía digital.'
        ],
        correct: 0,
        feedbackOk:
          'El yogur se produce por fermentación, un bioproceso en el que bacterias transforman la leche.',
        feedbackKo:
          'Revisa: de las opciones, solo una involucra organismos vivos transformando un material.'
      }
    }
  ]
};
