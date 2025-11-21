import { PrismaClient } from '@prisma/client';
import { Rate } from '../models/rate';

export class RatesService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createRate(data: Rate): Promise<Rate> {
    return await this.prisma.rate.create({
      data,
    });
  }

  async getRateById(id: number): Promise<Rate | null> {
    return await this.prisma.rate.findUnique({
      where: { id },
    });
  }

  async updateRate(id: number, data: Partial<Rate>): Promise<Rate> {
    return await this.prisma.rate.update({
      where: { id },
      data,
    });
  }

  async deleteRate(id: number): Promise<Rate> {
    return await this.prisma.rate.delete({
      where: { id },
    });
  }

  async getAllRates(): Promise<Rate[]> {
    return await this.prisma.rate.findMany();
  }
}