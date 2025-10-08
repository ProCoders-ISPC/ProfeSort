module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  setTimeout(() => {
    if (req.query.simulate_error === 'server') {
      return res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Simulación de error 500',
        timestamp: new Date().toISOString()
      });
    }

    if ((req.url === '/api/auth/login' || req.url === '/auth/login') && req.method === 'POST') {
      return handleLogin(req, res);
    }

    if ((req.url === '/api/auth/register' || req.url === '/auth/register') && req.method === 'POST') {
      return handleRegister(req, res);
    }
    
    next();
  }, Math.random() * 300 + 200);
};

function handleLogin(req, res) {
  const { email, password } = req.body;
  const fs = require('fs');
  const path = require('path');
  
  try {
    const dbPath = path.join(__dirname, 'db.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const user = db.users.find(u => 
      u.email === email && 
      u.password === password && 
      u.isActive
    );

    if (user) {
      return res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          legajo: user.legajo || null
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
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El usuario ya existe',
        error: 'Ya existe un usuario con este correo electrónico'
      });
    }

    // Verificar si el legajo ya existe
    const existingLegajo = db.users.find(u => u.legajo === legajo);
    if (existingLegajo) {
      return res.status(409).json({
        success: false,
        message: 'El legajo ya existe',
        error: 'Ya existe un usuario con este legajo'
      });
    }

    // Crear nuevo usuario
    const newUser = {
      id: Math.max(...db.users.map(u => u.id)) + 1,
      email,
      password,
      name: `${nombre} ${apellido}`,
      role: 'User',
      legajo,
      dni,
      fechaNacimiento,
      domicilio,
      telefono,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // Agregar usuario a la base de datos
    db.users.push(newUser);
    
    // Guardar cambios
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    // Respuesta exitosa
    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
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