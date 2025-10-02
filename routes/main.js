const { Router } = require('express');
const mainController = require('../controllers/main');

const mainRouter = Router();

mainRouter.get('/', mainController.home);
mainRouter.post('/sign-up', mainController.createUser);
mainRouter.post('/log-in', mainController.logInUser);
mainRouter.get('/log-out', mainController.logOut);
mainRouter.post('/new-message', mainController.createMessage);

module.exports = mainRouter;
