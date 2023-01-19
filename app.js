const express = require('express');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const userRoutes = require('./routes/user.js');    //pour importer les routes
const saucesRoutes = require('./routes/sauces.js');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
//const mdp = require('./mdp.env');
require('dotenv').config();
const dataBase = process.env.DATABASE;

// Se connecter à la base de données
mongoose.connect('mongodb+srv://Sam:manofsteel891@cluster0.jzjd9lt.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/*app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' });
   //next();
});*/

// pour le CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
// On enregistre le routeur
//app.use('/api/stuff', stuffRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
//app.use('/login', userRoutes);
app.use('/api/sauces', saucesRoutes);

// Modèle utilisateur
//const userSchema = require('./models/user.js');




module.exports = app;
