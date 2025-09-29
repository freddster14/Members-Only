const { Router } = require('express');
const mainController = require('../controllers/main');

const mainRouter = Router();

mainRouter.get('/', mainController.home);
mainRouter.get('/sign-up', mainController.signUp);
mainRouter.post('/sign-up', mainController.createUser);
mainRouter.get('/log-in', mainController.logIn);
mainRouter.post('/log-in', mainController.logInUser);

module.exports = mainRouter;
