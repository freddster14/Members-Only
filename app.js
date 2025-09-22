const express = require('express');
const path = require('node:path');
const mainRouter = require('./routes/main');

const app = express();
const PORT = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', mainRouter);

app.listen(PORT);
