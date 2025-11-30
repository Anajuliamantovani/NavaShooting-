const express = require('express');
const app = express();
const path = require('path');
const connection = require('./database/database');

// --- Models ---
const User = require('./models/user');
const Shot = require('./models/shot');
const PowerUp = require('./models/powerUp');
const Nave = require('./models/nave');
const Enemies = require('./models/enemies');
const bag = require('./models/bag');
const atributo = require('./models/atributo');

// Novos Models adicionados
const StoreNave = require('./models/storeNave');
const StoreShot = require('./models/storeShot');
const StoreEnemies = require('./models/storeEnemies');

const syncDatabase = async () => {
    try {
        console.log("🚧 Iniciando Recriação do Banco de Dados...");

        // 1. DESLIGA A SEGURANÇA (Permite criar tabelas fora de ordem)
        await connection.query("SET FOREIGN_KEY_CHECKS = 0", { raw: true });

        // 2. FORÇA A RECRIAÇÃO DE TUDO
        // O Sequelize vai criar as tabelas na ordem que ele quiser, 
        // mas como a segurança está desligada, o banco não vai reclamar.
        await connection.sync({ force: true });

        // 3. LIGA A SEGURANÇA DE VOLTA
        await connection.query("SET FOREIGN_KEY_CHECKS = 1", { raw: true });

        console.log("✅ Banco de dados recriado com sucesso!");

    } catch (error) {
        console.error("❌ Erro ao sincronizar:", error);
    }
};

// Execute uma vez, espere dar certo, e depois COMENTE esta linha
//syncDatabase();

// --- Routes imports ---
const userRoutes = require('./routes/userRoutes');
const shotRouter = require('./routes/shotRouter');
const powerUpRouter = require('./routes/powerUpRouter'); 
const naveRouter = require('./routes/naveRouter'); 
const enemiesRoutes = require('./routes/enemiesRoutes'); 
const bagRoutes = require('./routes/bagRoutes'); 
const atributoRouter = require('./routes/atributoRouter');

// Novos Routers adicionados
const storeNaveRouter = require('./routes/storeNaveRouter');
const storeShotRouter = require('./routes/storeShotRouter');
const storeEnemiesRouter = require('./routes/storeEnemiesRouter');


// --- Environment Setup ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/imagens', express.static(path.join(__dirname, 'public/uploads')));


// --- Database connection ---
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

   // --- Routes Registration ---
   app.use('/user', userRoutes);
   app.use('/shots', shotRouter); 
   app.use('/powerups', powerUpRouter); 
   app.use('/naves', naveRouter);
   app.use('/enemies', enemiesRoutes); 
   app.use('/bags', bagRoutes); 
   app.use('/atributos', atributoRouter);

   // Novas Rotas registradas
   app.use('/storeNave', storeNaveRouter);
   app.use('/storeShot', storeShotRouter);
   app.use('/storeEnemies', storeEnemiesRouter);

module.exports = app;