import express from 'express';
import mongoose from 'mongoose';
import {envValues} from './utils/general.utils';
import {register, login, changePassword} from './controllers/auth.controller';
import {authMiddleware} from './middlewares/auth.middleware';
import {getProfile} from './controllers/profile.controller';

const app = express();

app.use(express.json());

const {MONGO_URI, PORT} = envValues;

mongoose.connect(MONGO_URI).catch(error => {
  console.error('Unable to connect to mongo');
  throw new Error(error);
});

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/profiles', authMiddleware, getProfile);
router.post('/actions/changepassword', authMiddleware, changePassword);

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
