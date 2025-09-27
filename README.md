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

<p> En esta carpeta se desarrollará la interfaz del sistema usando Angular, incluyendo componentes, vistas y estilos. Conti
Es la base principal del proyecto Angular. En esta carpeta se encuentra toda la lógica, vistas y configuraciones del sistema. Contiene:

- **ap**: Carpeta principal de la aplicación.
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

## 🛠️ Instrucciones para probar el proyecto

Para ejecutar **ProfeSort** se utiliza una **mock API** que simula el backend.  
A continuación, se detallan los pasos de instalación y ejecución:

---

### Terminal 1 – API General

```bash
cd mock-api
npm install -g json-server
```
###
```bash
npx json-server@0.17.4 --watch db.json --routes routes.json --middlewares middleware.js --port 3000
```
👉 Función: Maneja los datos principales: estudiantes, materias, docentes y métricas.
🔗 Acceso: http://localhost:3000

### Terminal 2 – Frontend

```bash
cd frontend
npm install
```
###
```bash
ng serve -o
```
👉 Función: Levanta el frontend en Angular para visualizar la aplicación en el navegador.
🔗 Acceso: http://localhost:4200



-------------------
### 🔑 Credenciales de acceso

Para acceder a los paneles de administrador autenticado, existen credenciales preconfiguradas en el código:
```
"email": "admin@profesort.com"
"password": "admin123"
```

👉 Con estas credenciales podrás ingresar al panel de administración y probar las funcionalidades de gestión.

👉 Para acceder a los paneles de docente se debe registrar el usuario y luego iniciar sesión 

----------------------------------------
# Base de Datos ProfeSort

### 📋 Descripción
Sistema de gestión académica con PostgreSQL para manejo de docentes, materias y asignaciones.

## 🗃 Estructura de Tablas

### roles
- *id_rol* (PK): Identificador único
- *nombre*: ADMIN, DOCENTE, USUARIO  
- *descripcion*: Descripción del rol
- *permisos*: JSON con permisos específicos

### usuarios
- *id_usuario* (PK): Identificador único
- *email*: Correo único del usuario
- *name*: Nombre completo
- *role_id* (FK): Referencia a roles
- *legajo*: Número de legajo único
- Campos adicionales: dni, fecha_nacimiento, domicilio, etc.

### materias
- *id_materia* (PK): Identificador único
- *nombre*: Nombre de la materia
- *codigo* (UK): Código único de materia
- *horas_semanales*: Carga horaria semanal
- *area*: Área académica
- *nivel*: Nivel educativo

### asignaciones_docentes_materias
- *id_asignacion* (PK): Identificador único
- *id_rol* (FK): Rol asignado
- *id_materia* (FK): Materia asignada
- *estado*: Estado de la asignación

## 🛠 Pasos de instalación

### 1. Crear la base de datos
1. En **pgAdmin**:
   - Click derecho en **Databases** → **Create** → **Database...**
   - **Nombre**: `profesort_db`
   - **Owner**: `postgres` (o el usuario que vayas a usar)

---

### 2. Crear un usuario para la app
1. En **pgAdmin**:
   - Click derecho en **Login/Group Roles** → **Create** → **Login/Group Role...**
   - **Name**: `profesort_db_admin`
   - **Password**: `admin123` (o la que definas en `settings.py`)
   - En **Privileges**, marcar:
     - ✅ Can login?  
     - ✅ Create DB? (opcional)

---

### 3. Dar permisos al usuario
1. Click derecho en la base de datos `profesort_db` → **Properties** → **Privileges**
2. Agregar el usuario `profesort_db_admin` con permisos:
   - CONNECT  
   - TEMPORARY  
   - USAGE  
   - (o todos los disponibles)

---
## 4. Activar entorno 
- venv\Scripts\activate
-----
## 5. Instalar dependencias 
- pip install -r requirements.txt
-----
## 6. Aplicar migraciones 
- python manage.py migrate

------
## 7. Iniciar servidor
- python manage.py runserver

Acceder a:
👉 http://localhost:8000/admin
e ingresar con el superusuario creado.













