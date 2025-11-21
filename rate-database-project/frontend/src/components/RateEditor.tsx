import React, { useState } from 'react';
import { Rate } from '../types/rate';
import { createRate, updateRate } from '../api/rates';

type RateEditorProps = {
  rate?: Rate;
  onSave: () => void;
};

const RateEditor: React.FC<RateEditorProps> = ({ rate, onSave }) => {
  const [description, setDescription] = useState(rate?.description || '');
  const [unitPrice, setUnitPrice] = useState(rate?.unitPrice || 0);
  const [type, setType] = useState(rate?.type || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rateData = { description, unitPrice, type };

    try {
      if (rate) {
        await updateRate(rate.id, rateData);
      } else {
        await createRate(rateData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving rate:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Unit Price:
          <input
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(Number(e.target.value))}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Type:
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">{rate ? 'Update Rate' : 'Create Rate'}</button>
    </form>
  );
};

export default RateEditor;