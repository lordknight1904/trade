import { Router } from 'express';
import * as TransactionController from '../controllers/transaction.controller';
const router = new Router();

router.route('/price/:coin').get(TransactionController.getCoinLatestPrice);
router.route('/transaction/:userName/:coin').get(TransactionController.getTransaction);
router.route('/transaction/hash/:coin/:txHash').get(TransactionController.getHash);

export default router;
