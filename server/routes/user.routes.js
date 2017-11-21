import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
const router = new Router();

router.route('/user/create').post(UserController.createUser);
router.route('/user/google/activate').post(UserController.confirmGoogleAuth);
router.route('/user/google/authorize').post(UserController.googleFactor);
router.route('/user/google/cancel').post(UserController.cancelGoogleFactor);
router.route('/user/profile').post(UserController.updateUserProfile);
router.route('/user/inform').post(UserController.addInform);
router.route('/user/inform').delete(UserController.deleteInform);
router.route('/user/confirm').get(UserController.verifyUser);
router.route('/user/login').post(UserController.loginUser);
router.route('/user/balance/:userName/:coin').get(UserController.getBalance);
router.route('/user/hold/:userName/:coin').get(UserController.getBalance);
router.route(':id').get(UserController.getAllias);
router.route('/profile').get(UserController.getAllias);
router.route('/wallet').get(UserController.getAllias);

export default router;
