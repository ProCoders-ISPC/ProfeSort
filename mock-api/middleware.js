module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if ((req.url === '/api/auth/login' || req.url === '/auth/login') && req.method === 'POST') {
    return handleLogin(req, res);
  }

  if ((req.url === '/api/auth/register' || req.url === '/auth/register') && req.method === 'POST') {
    return handleRegister(req, res);
  }

  if (req.url.startsWith('/auth/validate-session/') && req.method === 'GET') {
    return handleValidateSession(req, res);
  }
  
  next();
};

function handleLogin(req, res) {
  const { email, password } = req.body;
  const fs = require('fs');
  const path = require('path');
  
  try {
    const dbPath = path.join(__dirname, 'db.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const user = db.usuarios.find(u => 
      u.email === email && 
      u.password === password && 
      u.is_active
    );

    if (user) {
      return res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          id_usuario: user.id,
          name: user.name,
          email: user.email,
          id_rol: user.id_rol,
          legajo: user.legajo || null,
          dni: user.dni,
          fecha_nacimiento: user.fecha_nacimiento,
          domicilio: user.domicilio,
          telefono: user.telefono,
          area: user.area,
          fecha_ingreso: user.fecha_ingreso,
          is_active: user.is_active
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        error: 'Email o contraseña incorrectos'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
}

// Handler para registro
function handleRegister(req, res) {
  const { nombre, apellido, email, password, dni, legajo, fechaNacimiento, domicilio, telefono } = req.body;
  const fs = require('fs');
  const path = require('path');
  
  try {
    const dbPath = path.join(__dirname, 'db.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Verificar si el email ya existe
    const existingUser = db.usuarios.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El usuario ya existe',
        error: 'Ya existe un usuario con este correo electrónico'
      });
    }

    // Verificar si el legajo ya existe
    const existingLegajo = db.usuarios.find(u => u.legajo === legajo);
    if (existingLegajo) {
      return res.status(409).json({
        success: false,
        message: 'El legajo ya existe',
        error: 'Ya existe un usuario con este legajo'
      });
    }

    // Crear nuevo usuario
    const newUser = {
      id: Math.max(...db.usuarios.map(u => u.id)) + 1,
      name: `${nombre} ${apellido}`,
      email,
      password,
      legajo,
      dni,
      fecha_nacimiento: fechaNacimiento,
      domicilio,
      telefono,
      id_rol: 3, // USUARIO por defecto
      area: null,
      is_active: true,
      fecha_ingreso: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    // Agregar usuario a la base de datos
    db.usuarios.push(newUser);
    
    // Guardar cambios
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    // Respuesta exitosa
    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id_usuario: newUser.id,
        name: newUser.name,
        email: newUser.email,
        id_rol: newUser.id_rol,
        legajo: newUser.legajo
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
}

// Handler para validar sesión
function handleValidateSession(req, res) {
  const userId = req.url.split('/').pop();
  const fs = require('fs');
  const path = require('path');
  
  try {
    const dbPath = path.join(__dirname, 'db.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Buscar el usuario por ID y verificar que esté activo
    const user = db.usuarios.find(u => u.id == userId && u.is_active);

    if (user) {
      return res.status(200).json({
        success: true,
        message: 'Sesión válida',
        data: {
          id_usuario: user.id,
          name: user.name,
          email: user.email,
          id_rol: user.role_id,
          legajo: user.legajo || null,
          dni: user.dni,
          fecha_nacimiento: user.fecha_nacimiento,
          domicilio: user.domicilio,
          telefono: user.telefono,
          area: user.area,
          fecha_ingreso: user.fecha_ingreso,
          is_active: user.is_active
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Sesión inválida',
        error: 'Usuario no encontrado o cuenta desactivada'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
}