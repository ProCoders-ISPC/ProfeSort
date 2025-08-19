# ProfeSort
<h1 align="left">Descripción del proyecto:</h1>

###

<p align="left">ProfeSort es un sistema de gestión digital integral diseñado para el Plan de Finalización de Estudios (FinEs). Su objetivo principal es optimizar los procesos administrativos y académicos, mejorando la eficiencia en la gestión de estudiantes, docentes y materias, y facilitando la toma de decisiones a partir de datos confiables. Este sistema busca elevar la calidad del servicio educativo ofrecido y modernizar la administración del plan.</p>

###

<h2 align="left">Funcionalidades Principales (Primera Etapa)</h2>

###

<p align="left">El sistema está siendo desarrollado por etapas. En esta primera fase se busca implementar funcionalidades esenciales, entre ellas:</p>

###

<ul align="left">
  <li>Visualización pública de un sitio web responsive con secciones de inicio, login/registro y sobre nosotros.</li><br>
  <li>Carga y gestión de la información de los estudiantes inscriptos por parte de los administradores del Plan FinEs.</li><br>
  <li>Gestión de materias: registro de materias y su asociación con áreas académicas específicas.</li><br>
  <li>Asignación de materias a los docentes correspondientes.</li><br>
  <li>Visualización de métricas básicas desde un panel de administración, como:
    <ul>
      <li>Cantidad total de estudiantes inscriptos.</li>
      <li>Porcentaje de inscriptos por materia.</li>
      <li>Número y porcentaje de estudiantes desmatriculados.</li>
    </ul>
  </li><br>
  <li>Acceso para docentes, quienes podrán registrarse y visualizar la lista de estudiantes asignados a su área.</li>
</ul>

###

<h3 align="left">Estado del Proyecto:</h3>

###

<p align="left">El proyecto se encuentra en su fase inicial de desarrollo. En este momento estamos definiendo las historias de usuario y preparando la documentación básica. A continuación, construiremos una maqueta estática para diseñar el frontend y establecer la estructura general del sistema, con la previsión de incorporar Angular para lograr una interfaz dinámica e interactiva. Una vez completada esta etapa, avanzaremos con la implementación del backend utilizando Django</p>

###

###

<h3 align="left">Tecnologías que se emplearán en el proyecto:</h3>

###

<h4 align="left">Maqueta estática:</h4>

###

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="40" alt="html5 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="40" alt="css3 logo"  />
</div>

###

<h4 align="left">Frontend:</h4>

###

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" height="40" alt="angularjs logo"  />
</div>

###

<h4 align="left">Backend:</h4>

###

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" height="40" alt="python logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" height="40" alt="django logo"  />
</div>

###


###

<h2 align="left">Estructura de carpetas y justificacion</h2>

````bash
maqueta/
````
<p>

<p>Es la base estática del proyecto. En esta carpeta se diseñan los prototipos iniciales del sistema, que permiten visualizar la estructura y distribución de los elementos. Contiene:<ul> <li><b>assets/</b>: Archivos estáticos utilizados por la maqueta. Contiene: <ul> <li><code>css/</code>: Estilos principales del sitio. <ul> <li><code>base/</code>: Estilos generales como reset, variables, etc.</li> <li><code>components/</code>: Estilos reutilizables (botones, formularios, tarjetas).</li> <li><code>pages/</code>: Estilos específicos para cada vista (por ejemplo, login, about, panel).</li> <li><code>styles.css</code>: Archivo central que importa los demás y aplica los estilos globales.</li> </ul> </li> <li><code>fonts/</code>: Tipografías personalizadas del sistema.</li> <li><code>img/</code>: Imágenes usadas en las vistas.</li> <li><code>js/</code>: Código JavaScript para funcionalidades del sitio (por ejemplo, <code>home.js</code> para sliders con Swiper.js).</li> <li><code>videos/</code>: Recursos audiovisuales si se usan en el sitio.</li> </ul> </li> <li><b>pages/</b>: Contiene vistas individuales del sistema. <ul> <li><code>admin_forms/</code>: Formularios administrativos que serán parte del panel.</li> <li><code>portfolios/</code>: Subcarpetas por integrante del equipo, usadas para prácticas o versiones personales. <ul> <li><code>cristian_vargas/</code></li> <li><code>daniel_paez/</code></li> <li><code>juanignacio_gioda/</code></li> <li><code>juanpablo_sanchez/</code></li> <li><code>karina_quinteros/</code></li> <li><code>laura_zarate/</code></li> </ul> </li> <li><b>Archivos .html principales:</b> <ul> <li><code>about.html</code>: Sección “Sobre nosotros”.</li> <li><code>login.html</code>: Formulario de inicio de sesión.</li> <li><code>register.html</code>: Formulario de registro.</li> <li><code>panel-admin.html</code>: Panel de administración.</li> </ul> </li> </ul> </li> </ul>
<li><code>index.html</code>: Página de inicio del sitio web.</li> 

````bash


frontend/
````
<p> En esta carpeta se desarrollará la interfaz del sistema usando Angular, incluyendo componentes, vistas y estilos. Contiene:</p>
 
 - **src/**:
Es la base principal del proyecto Angular. En esta carpeta se encuentra toda la lógica, vistas y configuraciones del sistema. Contiene:

- **app/**: Carpeta principal de la aplicación.
  - **core/**: Lógica global, cargada una sola vez en el sistema.
    - **guards/**: Mecanismos de seguridad para las rutas (ejemplo: `AuthGuard`, `RoleGuard`).
    - **interceptors/**: Interceptores HTTP para autenticación y manejo de errores.
    - **models/**: Interfaces y clases de dominio (ejemplo: `Usuario`, `Docente`, `Estudiante`, `Materia`).
    - **services/**: Servicios globales utilizados en toda la aplicación (ejemplo: `AuthService`, `ApiService`).
  - **shared/**: Elementos reutilizables en todo el sistema.
    - **components/**: Componentes compartidos (Navbar, Footer, botones, inputs).
    - **directives/**: Directivas personalizadas.
    - **pipes/**: Pipes personalizados.
  - **features/**: Funcionalidades organizadas por módulos.
    - **auth/**: Módulo de autenticación del sistema.
      - **login/**: Vista de inicio de sesión (`LoginComponent`).
      - **register/**: Vista de registro (`RegisterComponent`).
    - **public/**: Páginas públicas accesibles sin autenticación.
      - **layout/**: `PublicLayoutComponent` (estructura general: header, nav, footer).



````bash
backend/
````
<p> Esta carpeta contendrá la lógica de negocio, los servicios, y la conexión con la base de datos. Su desarrollo se realizará en una etapa posterior al diseño de la maqueta y la implementación del frontend. </p>

###

###

<h2 align="left">Instrucciones para probar el proyecto</h2>

###
<p>Para comenzar con ProfeSort, sigue estos pasos:</p> 

<ol>
  <li>Asegúrate de tener Git instalado en tu equipo.</li>
  <li>Abre una terminal y sitúate en la carpeta donde deseas clonar el repositorio.</li>
  <li>Ejecuta el comando<br>
    <code>git clone https://github.com/ProCoders-ISPC/ProfeSort.git</code>
  </li>
  <li>Entra en el directorio del proyecto:<br>
    <code>cd ProfeSort</code>
  </li>
</ol>

<p>Dado que actualmente ProfeSort se encuentra en su fase inicial de desarrollo, aún no cuenta con instrucciones de ejecución. Próximamente añadiremos detalles sobre cómo instalar dependencias y levantar tanto la maqueta estática como el frontend y el backend.</p>

###

