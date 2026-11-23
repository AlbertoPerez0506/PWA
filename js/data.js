// data.js — Contenido educativo: juegos y examen.

// ---------- Juego 1: Exploradores de la biodiversidad ----------
export const biodiversityQuestions = [
  {
    id: 'bio-1', icon: 'bird',
    prompt: '¿A qué grupo pertenece este organismo?',
    context: 'Tiene plumas, pone huevos y puede volar.',
    options: ['Ave', 'Mamífero', 'Reptil', 'Anfibio'],
    correct: 0,
    feedback: 'Las aves se caracterizan por tener plumas, un pico y poner huevos.'
  },
  {
    id: 'bio-2', icon: 'fish',
    prompt: '¿A qué grupo pertenece este organismo?',
    context: 'Vive en el agua, respira por branquias y tiene escamas.',
    options: ['Anfibio', 'Pez', 'Reptil', 'Mamífero'],
    correct: 1,
    feedback: 'Los peces respiran por branquias y la mayoría tiene escamas.'
  },
  {
    id: 'bio-3', icon: 'bug',
    prompt: '¿A qué grupo pertenece este organismo?',
    context: 'Tiene seis patas y su cuerpo se divide en cabeza, tórax y abdomen.',
    options: ['Arácnido', 'Insecto', 'Crustáceo', 'Molusco'],
    correct: 1,
    feedback: 'Los insectos tienen seis patas y su cuerpo se divide en tres partes.'
  },
  {
    id: 'bio-4', icon: 'tree-pine',
    prompt: '¿Qué tipo de organismo es?',
    context: 'Produce su propio alimento mediante la fotosíntesis.',
    options: ['Hongo', 'Planta', 'Bacteria', 'Animal'],
    correct: 1,
    feedback: 'Las plantas producen su alimento a través de la fotosíntesis.'
  },
  {
    id: 'bio-5', icon: 'leaf',
    prompt: '¿Qué función cumple este organismo en el ecosistema?',
    context: 'Un árbol de gran tamaño que produce oxígeno.',
    options: ['Productor', 'Consumidor', 'Descomponedor', 'Depredador'],
    correct: 0,
    feedback: 'Los árboles son productores: generan alimento y oxígeno.'
  },
  {
    id: 'bio-6', icon: 'sparkles',
    prompt: '¿Qué tipo de organismo es?',
    context: 'Se alimenta de materia orgánica en descomposición y la recicla.',
    options: ['Productor', 'Herbívoro', 'Descomponedor', 'Carnívoro'],
    correct: 2,
    feedback: 'Los descomponedores reciclan nutrientes al descomponer materia orgánica.'
  },
  {
    id: 'bio-7', icon: 'fish',
    prompt: '¿Qué es un organismo autótrofo?',
    context: 'Elige la opción correcta.',
    options: ['Produce su propio alimento', 'Solo come carne', 'No se reproduce', 'No necesita agua'],
    correct: 0,
    feedback: 'Los autótrofos (como las plantas) producen su propio alimento.'
  },
  {
    id: 'bio-8', icon: 'leaf',
    prompt: '¿Qué es la biodiversidad?',
    context: 'Elige la definición correcta.',
    options: [
      'La variedad de seres vivos y sus ecosistemas',
      'Solo la cantidad de árboles',
      'Los animales de un zoológico',
      'La cantidad de agua de un río'
    ],
    correct: 0,
    feedback: 'La biodiversidad incluye la variedad de organismos y ecosistemas.'
  }
];

// ---------- Juego 2: Equilibrio de los ecosistemas ----------
export const ecosystemQuestions = [
  {
    id: 'eco-1', icon: 'leaf',
    prompt: '¿Qué papel cumple el conejo en esta cadena alimenticia?',
    context: 'Planta → Conejo → Zorro',
    options: ['Productor', 'Consumidor primario', 'Consumidor secundario', 'Descomponedor'],
    correct: 1,
    feedback: 'El conejo come plantas, por eso es un consumidor primario.'
  },
  {
    id: 'eco-2', icon: 'leaf',
    prompt: '¿Qué papel cumple el zorro en esta cadena alimenticia?',
    context: 'Planta → Conejo → Zorro',
    options: ['Productor', 'Consumidor primario', 'Consumidor secundario', 'Descomponedor'],
    correct: 2,
    feedback: 'El zorro se alimenta del conejo, por eso es un consumidor secundario.'
  },
  {
    id: 'eco-3', icon: 'sun',
    prompt: '¿De dónde obtienen energía los productores?',
    context: 'En la mayoría de ecosistemas...',
    options: ['Del suelo', 'Del sol', 'De otros animales', 'Del aire'],
    correct: 1,
    feedback: 'Los productores usan la energía del sol mediante la fotosíntesis.'
  },
  {
    id: 'eco-4', icon: 'bug',
    prompt: '¿Qué organismo descompone la materia orgánica?',
    context: 'Restos de hojas y animales muertos...',
    options: ['Conejo', 'Hongo', 'Zorro', 'Árbol'],
    correct: 1,
    feedback: 'Los hongos y bacterias descomponen la materia orgánica y reciclan nutrientes.'
  },
  {
    id: 'eco-5', icon: 'leaf',
    prompt: 'Si desaparecieran los productores de un ecosistema, ¿qué ocurriría?',
    context: 'Piensa en la cadena alimenticia.',
    options: [
      'Nada, seguiría igual',
      'Los consumidores no tendrían alimento',
      'Los descomponedores crecerían',
      'Aparecerían más productores'
    ],
    correct: 1,
    feedback: 'Sin productores no habría alimento para los consumidores.'
  },
  {
    id: 'eco-6', icon: 'droplets',
    prompt: '¿Qué es un factor abiótico?',
    context: 'Dentro de un ecosistema...',
    options: [
      'Un ser vivo',
      'Un componente no vivo como el agua o la luz',
      'Un animal carnívoro',
      'Un hongo'
    ],
    correct: 1,
    feedback: 'Los factores abióticos son elementos no vivos: agua, luz, suelo, temperatura.'
  },
  {
    id: 'eco-7', icon: 'tree-pine',
    prompt: '¿Qué es un factor biótico?',
    context: 'Dentro de un ecosistema...',
    options: [
      'Los seres vivos del ecosistema',
      'El agua',
      'La luz solar',
      'La temperatura'
    ],
    correct: 0,
    feedback: 'Los factores bióticos son los seres vivos que habitan un ecosistema.'
  },
  {
    id: 'eco-8', icon: 'sparkles',
    prompt: '¿Cómo se transfiere la energía en una cadena alimenticia?',
    context: 'Desde los productores hacia los consumidores...',
    options: [
      'En forma de agua',
      'Al comer y ser comido',
      'Por el viento',
      'Nunca se transfiere'
    ],
    correct: 1,
    feedback: 'La energía fluye cuando un organismo se alimenta de otro.'
  }
];

// ---------- Juego 3: Guardianes de las Bioislas ----------
export const conservationQuestions = [
  {
    id: 'con-1', icon: 'recycle',
    prompt: 'Encuentras basura tirada junto a un río. ¿Qué haces?',
    context: 'La basura puede contaminar el agua y afectar a la fauna.',
    options: [
      'La dejo ahí, no es mi responsabilidad',
      'La recojo y la deposito en un contenedor adecuado',
      'La arrojo al río para que se la lleve el agua',
      'La entierro en el bosque'
    ],
    correct: 1,
    feedback: 'Recoger la basura evita la contaminación y protege el ecosistema.'
  },
  {
    id: 'con-2', icon: 'tree-pine',
    prompt: 'Ves a alguien cortando árboles en un bosque protegido. ¿Qué haces?',
    context: 'La deforestación destruye hábitats y afecta el clima.',
    options: [
      'No hago nada',
      'Reporto la situación a las autoridades ambientales',
      'Corto yo también un árbol',
      'Le ayudo'
    ],
    correct: 1,
    feedback: 'Reportar la tala ilegal ayuda a proteger los ecosistemas.'
  },
  {
    id: 'con-3', icon: 'droplets',
    prompt: 'Para ahorrar agua en casa, ¿cuál es una buena práctica?',
    context: 'El agua es un recurso limitado.',
    options: [
      'Dejar la llave abierta mientras me cepillo los dientes',
      'Cerrar la llave mientras me enjabono',
      'Tomar duchas de una hora',
      'Lavar el auto a diario con manguera'
    ],
    correct: 1,
    feedback: 'Cerrar la llave mientras te enjabonas ahorra mucha agua.'
  },
  {
    id: 'con-4', icon: 'bug',
    prompt: 'Ves un insecto desconocido en tu casa. ¿Qué haces?',
    context: 'Los insectos cumplen funciones importantes en el ecosistema.',
    options: [
      'Lo mato sin pensar',
      'Lo observo y lo saco con cuidado al exterior',
      'Lo aplasto',
      'Le echo veneno'
    ],
    correct: 1,
    feedback: 'Muchos insectos son polinizadores y esenciales para el equilibrio.'
  },
  {
    id: 'con-5', icon: 'leaf',
    prompt: '¿Cuál de estas acciones ayuda a proteger la biodiversidad?',
    context: 'Dentro de una ciudad...',
    options: [
      'Sembrar plantas nativas',
      'Talar todos los árboles',
      'Rellenar humedales con cemento',
      'Arrojar plásticos al río'
    ],
    correct: 0,
    feedback: 'Sembrar plantas nativas crea hábitats y atrae polinizadores.'
  },
  {
    id: 'con-6', icon: 'recycle',
    prompt: '¿Por qué es importante separar la basura?',
    context: 'En casa o en la escuela...',
    options: [
      'Porque ocupa menos espacio',
      'Porque facilita el reciclaje y reduce la contaminación',
      'Porque hace más ruido',
      'No tiene importancia'
    ],
    correct: 1,
    feedback: 'Separar la basura permite reciclar y reduce el impacto ambiental.'
  },
  {
    id: 'con-7', icon: 'droplets',
    prompt: '¿Qué problema causa el uso excesivo de plásticos?',
    context: 'Mira a tu alrededor...',
    options: [
      'Mejora la calidad del aire',
      'Contamina océanos y daña la fauna',
      'Aumenta la lluvia',
      'Ninguno'
    ],
    correct: 1,
    feedback: 'Los plásticos contaminan océanos y amenazan a muchos animales.'
  },
  {
    id: 'con-8', icon: 'bird',
    prompt: 'Ves un nido de aves en un árbol que van a talar. ¿Qué haces?',
    context: 'Las aves necesitan sus nidos para reproducirse.',
    options: [
      'Lo destruyo',
      'Aviso a las personas responsables para que lo protejan',
      'Lo llevo a mi casa',
      'Ahuyento a las aves'
    ],
    correct: 1,
    feedback: 'Proteger los nidos permite que las aves continúen su ciclo de vida.'
  }
];

// ---------- Examen final ----------
export const examQuestions = [
  {
    id: 'exam-1', icon: 'leaf',
    prompt: '¿Qué es la biodiversidad?',
    context: 'Elige la opción más completa.',
    options: [
      'La variedad de seres vivos y ecosistemas',
      'La cantidad de árboles de un bosque',
      'Los animales de un zoológico',
      'La cantidad de agua de un río'
    ],
    correct: 0,
    feedback: 'La biodiversidad abarca la variedad de organismos y ecosistemas.'
  },
  {
    id: 'exam-2', icon: 'droplets',
    prompt: '¿Cuál es un factor abiótico de un ecosistema?',
    context: 'Distingue entre seres vivos y no vivos.',
    options: ['Un árbol', 'Un pez', 'El agua', 'Un hongo'],
    correct: 2,
    feedback: 'El agua es un factor abiótico: no es un ser vivo.'
  },
  {
    id: 'exam-3', icon: 'sun',
    prompt: '¿De qué fuente principal obtienen energía los productores?',
    context: 'Piensa en la fotosíntesis.',
    options: ['Del suelo', 'Del sol', 'De otros animales', 'De los descomponedores'],
    correct: 1,
    feedback: 'Los productores captan energía del sol.'
  },
  {
    id: 'exam-4', icon: 'bug',
    prompt: '¿Qué organismo es un descomponedor?',
    context: 'Recicla materia orgánica.',
    options: ['Árbol', 'Conejo', 'Hongo', 'Zorro'],
    correct: 2,
    feedback: 'Los hongos y bacterias descomponen la materia orgánica.'
  },
  {
    id: 'exam-5', icon: 'leaf',
    prompt: 'En la cadena Planta → Conejo → Zorro, ¿qué rol cumple el zorro?',
    context: 'Observa la posición del zorro.',
    options: ['Productor', 'Consumidor primario', 'Consumidor secundario', 'Descomponedor'],
    correct: 2,
    feedback: 'El zorro come al conejo, por lo que es consumidor secundario.'
  },
  {
    id: 'exam-6', icon: 'recycle',
    prompt: '¿Cuál acción ayuda a conservar el ambiente?',
    context: 'Elige la opción más adecuada.',
    options: [
      'Separar la basura y reciclar',
      'Talar árboles',
      'Arrojar plásticos al río',
      'Quemar bosques'
    ],
    correct: 0,
    feedback: 'Reciclar reduce la contaminación y conserva recursos.'
  },
  {
    id: 'exam-7', icon: 'tree-pine',
    prompt: '¿Qué son los factores bióticos?',
    context: 'En un ecosistema...',
    options: [
      'Los componentes no vivos',
      'Los seres vivos',
      'La temperatura',
      'El viento'
    ],
    correct: 1,
    feedback: 'Los factores bióticos son los seres vivos del ecosistema.'
  },
  {
    id: 'exam-8', icon: 'shield',
    prompt: '¿Por qué es importante conservar la biodiversidad?',
    context: 'Piensa en el equilibrio natural.',
    options: [
      'Porque mantiene el equilibrio de los ecosistemas',
      'Solo porque es bonita',
      'No es importante',
      'Para tener más zoológicos'
    ],
    correct: 0,
    feedback: 'La biodiversidad mantiene el equilibrio y la salud de los ecosistemas.'
  },
  {
    id: 'exam-9', icon: 'fish',
    prompt: '¿Qué organismo es un productor?',
    context: 'Produce su propio alimento.',
    options: ['Zorro', 'Conejo', 'Planta', 'Hongo'],
    correct: 2,
    feedback: 'Las plantas son productoras: fabrican su alimento vía fotosíntesis.'
  },
  {
    id: 'exam-10', icon: 'lightbulb',
    prompt: '¿Qué puedes hacer para proteger los ecosistemas?',
    context: 'Elige la opción más completa.',
    options: [
      'Ahorrar agua, reciclar y sembrar plantas nativas',
      'Solo ver videos sobre ecología',
      'Ignorar los problemas ambientales',
      'Comprar más plásticos'
    ],
    correct: 0,
    feedback: 'Ahorrar agua, reciclar y sembrar plantas nativas contribuye a la conservación.'
  }
];
