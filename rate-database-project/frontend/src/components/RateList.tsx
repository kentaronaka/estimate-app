import React, { useEffect, useState } from 'react';
import { Rate } from '../types/rate';
import { fetchRates } from '../api/rates';

const RateList: React.FC = () => {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRates = async () => {
      try {
        const data = await fetchRates();
        setRates(data);
      } catch (err) {
        setError('Failed to fetch rates');
      } finally {
        setLoading(false);
      }
    };

    loadRates();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Rate List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Unit Price</th>
          </tr>
        </thead>
        <tbody>
          {rates.map(rate => (
            <tr key={rate.id}>
              <td>{rate.id}</td>
              <td>{rate.description}</td>
              <td>{rate.unitPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RateList;