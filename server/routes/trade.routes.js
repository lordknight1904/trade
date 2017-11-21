import { Router } from 'express';
import * as TradeController from '../controllers/trade.controller';
const router = new Router();

router.route('/trade').post(TradeController.trade);
router.route('/trade/:address').post(TradeController.webHook);

export default router;
