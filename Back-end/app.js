const express = require('express');
const app = express();
const connection = require('./database/database');

// Models
const User = require('./models/user');
//const Tipo = require('./models/tipo');
//const Figurinha = require('./models/figurinha');
const Shot = require('./models/shot');
const PowerUp = require('./models/powerUp');
const Nave = require('./models/nave');
const Enemies = require('./models/enemies');
const bag = require('./models/bag');
const atributo = require('./models/atributo');

/*connection.sync({force: true}) // Sincroniza todos os modelos conectados à essa instância
    .then(() => {
        console.log("Banco de dados sincronizado com sucesso!");
        // Comece seu servidor aqui
    })
    .catch(err => {
        console.error("Erro ao sincronizar o banco de dados:", err);
    });
*/

// Routes imports
const userRoutes = require('./routes/userRoutes');
//const tipoRoutes = require('./routes/tipoRoutes');
//const figurinhaRoutes = require('./routes/figurinhaRoutes');
const shotRouter = require('./routes/shotRouter');
const powerUpRouter = require('./routes/powerUpRouter'); 
const naveRouter = require('./routes/naveRouter'); 
const enemiesRoutes = require('./routes/enemiesRoutes'); 
const bagRoutes = require('./routes/bagRoutes'); 
const atributoRouter = require('./routes/atributoRouter');


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
   app.use('/user', userRoutes);
   //app.use('/tipos', tipoRoutes);
   //app.use('/figurinha', figurinhaRoutes);
   app.use('/shots', shotRouter); 
   app.use('/powerups', powerUpRouter); 
   app.use('/naves', naveRouter);
   app.use('/enemies', enemiesRoutes); 
   app.use('/bags', bagRoutes); 
   app.use('/atributos', atributoRouter);

module.exports = app;
