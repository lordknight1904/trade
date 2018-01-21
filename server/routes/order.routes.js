import { Router } from 'express';
import * as OrderController from '../controllers/order.controller';
const router = new Router();

router.route('/order/done/:coin/:userName/:id').post(OrderController.hook);
router.route('/order').post(OrderController.createOrder);
router.route('/order/send').post(OrderController.send);
router.route('/order').delete(OrderController.deleteOrder);
router.route('/order/:coin/:type').get(OrderController.getOrder);
router.route('/order/individual/:coin/:userName').get(OrderController.getMyOrder);

export default router;
