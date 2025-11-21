export interface Rate {
  id: string;
  type: 'technician' | 'machine' | 'security';
  description: string;
  unitPrice: number;
  createdAt: Date;
  updatedAt: Date;
}