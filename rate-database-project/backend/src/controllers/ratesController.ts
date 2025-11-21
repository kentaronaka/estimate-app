import { Request, Response } from 'express';
import RatesService from '../services/ratesService';

class RatesController {
  private ratesService: RatesService;

  constructor() {
    this.ratesService = new RatesService();
  }

  public async createRate(req: Request, res: Response): Promise<void> {
    try {
      const rateData = req.body;
      const newRate = await this.ratesService.createRate(rateData);
      res.status(201).json(newRate);
    } catch (error) {
      res.status(500).json({ message: 'Error creating rate', error });
    }
  }

  public async getRates(req: Request, res: Response): Promise<void> {
    try {
      const rates = await this.ratesService.getRates();
      res.status(200).json(rates);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving rates', error });
    }
  }

  public async updateRate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const rateData = req.body;
      const updatedRate = await this.ratesService.updateRate(id, rateData);
      res.status(200).json(updatedRate);
    } catch (error) {
      res.status(500).json({ message: 'Error updating rate', error });
    }
  }

  public async deleteRate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.ratesService.deleteRate(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting rate', error });
    }
  }
}

export default RatesController;