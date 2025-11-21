import { Router } from 'express';
import RatesController from '../controllers/ratesController';

const router = Router();
const ratesController = new RatesController();

// Define routes for rates
router.get('/', ratesController.getAllRates.bind(ratesController));
router.get('/:id', ratesController.getRateById.bind(ratesController));
router.post('/', ratesController.createRate.bind(ratesController));
router.put('/:id', ratesController.updateRate.bind(ratesController));
router.delete('/:id', ratesController.deleteRate.bind(ratesController));

export default router;