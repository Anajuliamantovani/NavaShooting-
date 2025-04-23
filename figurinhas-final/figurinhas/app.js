const express = require('express');
const app = express();
const connection = require('./database/database');

// Models
const Usuario = require('./models/usuario');
const Tipo = require('./models/tipo');
const Figurinha = require('./models/figurinha');

// Routes imports
const usuarioRoutes = require('./routes/usuarioRoutes');
const tipoRoutes = require('./routes/tipoRoutes');
const figurinhaRoutes = require('./routes/figurinhaRoutes');

// Environment Setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database connection
connection
   .authenticate()
   .then(() => {
    console.log('Conexão feita com sucesso!');
   })
   .catch(error => {
    console.log(error);
   });

   // Access from other origin (CORS)
   app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
         'Access-Control-Allow-Headers',
         'Origin, X-Requested-Width, Content-Type, Accept, Authorization'
      );
      res.setHeader(
         'Access-Control-Allow-Methods',
         'GET, POST, PATCH, PUT, DELETE, OPTIONS'
      );
      next();
   })

   // Routes
   app.use('/usuarios', usuarioRoutes);
   app.use('/tipos', tipoRoutes);
   app.use('/figurinha', figurinhaRoutes);

module.exports = app;
