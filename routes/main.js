const { Router } = require('express');
const mainController = require('../controllers/main');

const mainRouter = Router();

mainRouter.get('/', mainController.home);
mainRouter.post('/sign-up', mainController.createUser);

module.exports = mainRouter;
