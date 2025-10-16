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

# Instrucciones para probar el proyecto

Para ejecutar **ProfeSort** se detallan los pasos de instalación y ejecución:

## Instalación y Ejecución Local

Sigue estos pasos para configurar y levantar el servidor backend en tu entorno de desarrollo.

### 1. Preparación del Entorno

1.  **Navega al directorio del proyecto `backend`**:
    ```bash
    cd backend
    ```

2.  **Crea y activa un entorno virtual** (recomendado para aislar dependencias):
    ```bash
    python -m venv venv
    
    venv\Scripts\activate
    
    ```

3.  **Instala las dependencias** de Python:
    ```bash
    pip install -r requirements.txt
    ```

### 2. Configuración de la Base de Datos

1.  **Crea el archivo de variables de entorno `.env`** en el directorio `backend/` y configúralo con tus credenciales de PostgreSQL.

    ```bash
    DB_NAME=profesort_db
    DB_USER=postgres
    DB_PASSWORD=tu_password  # Coloca tu contraseña real de PostgreSQL
    DB_HOST=localhost
    DB_PORT=5432
    
    SECRET_KEY=tu_secret_key # Generás una clave segura
    DEBUG=True
    ```

2.  **Crea la base de datos PostgreSQL** (ejecuta esto en tu cliente de base de datos, como pgAdmin o psql):
    ```sql
    CREATE DATABASE profesort_db;
    ```

### 3. Inicialización del Sistema

1.  **Ejecuta las migraciones** de Django para crear las tablas:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

2.  **Inicializa los datos base** (roles y un usuario administrador):
    ```bash
    python init_data.py
    ```

### 4. Ejecutar el Servidor

Inicia el servidor de desarrollo de Django:

```bash

python manage.py runserver
```

-----------
<h2>2. Frontend (Angular)</h2>
<p>El frontend es la aplicación web que interactúa con la API.</p>

<h3>2 Instalación y Ejecución</h3>

<ol>
    <li>
        <strong>Abre una nueva terminal y navega al directorio <code>frontend</code></strong>:
        <pre><code class="bash">cd frontend</code></pre>
    </li>
    <li>
        <strong>Instala las dependencias de Node.js</strong> (asegúrate de tener Node.js y npm instalados):
        <pre><code class="bash">npm install</code></pre>
    </li>
    <li>
        <strong>Inicia el servidor de desarrollo y abre la aplicación</strong>:
        <pre><code class="bash">ng serve -o</code></pre>
        <p>La aplicación se abrirá automáticamente (usualmente en <code>http://localhost:4200</code>), y ya podrás ver la interfaz visual.</p>
    </li>
</ol>

<hr>

<h2>🏃 Flujo de Trabajo (Demostración)</h2>
<p>Una vez que ambos servidores (Backend y Frontend) están corriendo, puedes simular el flujo de trabajo inicial del sistema:</p>

<ol>
    <li>
        <strong>Inicio de Sesión como Administrador:</strong>
        <ul>
            <li>Ingresa a la aplicación web (Frontend) e inicia sesión con las credenciales: <strong>admin@profesort.com / Admin123456</strong>.</li>
            <li>Desde el panel, navega a la sección de Materias y <strong>Crea una nueva Materia</strong> (ej. "Historia").</li>
        </ul>
    </li>
    <li>
        <strong>Registro de un Nuevo Docente:</strong>
        <ul>
            <li><strong>Cierra la sesión</strong> del administrador.</li>
            <li>Utiliza la opción de <strong>Registro</strong> en la interfaz para crear una cuenta nueva. Esta cuenta representará a un nuevo Docente.</li>
        </ul>
    </li>
    <li>
        <strong>Asignación de Materia (Administrador):</strong>
        <ul>
            <li>Vuelve a <strong>iniciar sesión como administrador</strong>.</li>
            <li>Desde el panel, navega a la sección de Asignación Docente-Materia y <strong>Asigna la Materia</strong> que creaste (ej. "Historia") al Docente que acabas de registrar.</li>
        </ul>
    </li>
    <li>
        <strong>Verificación Docente:</strong>
        <ul>
            <li><strong>Cierra la sesión</strong> del administrador.</li>
            <li><strong>Inicia sesión como el Docente</strong> recién registrado.</li>
            <li>El docente podrá ver la Materia Asignada ("Historia") en su panel o listado de cursos.</li>
        </ul>
    </li>
</ol>
