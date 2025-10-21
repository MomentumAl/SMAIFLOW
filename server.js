const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Servir los archivos estáticos desde la carpeta 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Redirigir todas las demás solicitudes al index.html para que React Router funcione
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`SmaiFlow server listening on port ${port}`);
});