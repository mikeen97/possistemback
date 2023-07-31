const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');
const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler');
const sequelize = require('./libs/sequelize')

const app = new express();
const port = 3000;

app.use(express.json());

app.use(cors());

require('./utils/auth');

app.get('/', (req, res) => {
    res.send('hello cadima!!!');
});

apiRouter(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
    console.log('run!!');
    testConexion();
});

async function testConexion() {
    try {
        await sequelize.authenticate();
        console.log('Conexión exitosa a base de datos');
    } catch (error) {
        console.error('No se puede conectar a la base de datos', error);
    }
}