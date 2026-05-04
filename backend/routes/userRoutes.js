import express from 'express';                                      
import authUser from '../middlewares/authUser.js';
const userRouter = express.Router();

import {registerUser,loginUser,checkAuth,logotUser} from '../controllers/userController.js';

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/is-auth',authUser, checkAuth);  // it provide user data if user is authenticated
userRouter.post('/logout',authUser, logotUser);

export default userRouter;