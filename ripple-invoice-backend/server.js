require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require("./routes/auth");

const invoiceRoutes = require('./routes/invoices');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/invoices', invoiceRoutes);
app.use("/auth", authRoutes);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
    .then(() => {
      console.log('Connessione a MongoDB riuscita');
      app.listen(3000, () => console.log('Server avviato su http://localhost:3000'));
    })
    .catch(err => console.error('Errore connessione MongoDB:', err));