const { Router } = require('express');
const mainController = require('../controllers/main');

const mainRouter = Router();

mainRouter.get('/', mainController.intro);
mainRouter.get('/posts', mainController.home);
mainRouter.get('/log-out', mainController.logOut);
mainRouter.get('/profile/:id', mainController.profile);
mainRouter.get('/admin', mainController.admin);

mainRouter.post('/delete/:id', mainController.deleteUserPost);
mainRouter.post('/sign-up', mainController.createUser);
mainRouter.post('/log-in', mainController.logInUser);
mainRouter.post('/new-message', mainController.createPost);
mainRouter.post('/passcode', mainController.checkPasscode);
mainRouter.post('/admin', mainController.adminSignUp);

module.exports = mainRouter;
