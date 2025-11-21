import axios from 'axios';
import { Rate } from '../types/rate';

const API_URL = 'http://localhost:5000/api/rates'; // Adjust the URL as needed

export const fetchRates = async (): Promise<Rate[]> => {
  const response = await axios.get<Rate[]>(API_URL);
  return response.data;
};

export const createRate = async (rate: Rate): Promise<Rate> => {
  const response = await axios.post<Rate>(API_URL, rate);
  return response.data;
};

export const updateRate = async (id: string, rate: Rate): Promise<Rate> => {
  const response = await axios.put<Rate>(`${API_URL}/${id}`, rate);
  return response.data;
};

export const deleteRate = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};