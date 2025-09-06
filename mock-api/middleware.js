module.exports = (req, res, next) => {
  // Agregar headers CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  // Logging de requests
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Simular latencia de red
  setTimeout(() => {
    // Simular errores basados en query parameters
    if (req.query.simulate_error === 'server') {
      return res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Simulación de error 500',
        timestamp: new Date().toISOString()
      });
    }
    
    next();
  }, Math.random() * 300 + 200);
};