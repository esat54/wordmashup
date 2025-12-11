require('dotenv').config();
const express = require('express'); 
const cors = require('cors'); 
const morgan = require('morgan'); // Hata görmek için 

const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('dev')); // Sunucuya gelen her isteği terminale yazar
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));