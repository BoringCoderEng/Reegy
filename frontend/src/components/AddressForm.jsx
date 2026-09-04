import { useState } from 'react';
import axios from 'axios';
import './AddressForm.css';

const API_URL = 'http://localhost:3000/api/address';

function AddressForm({ onSaved, onCancel }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const token = localStorage.getItem('token');
    const form = e.target;

    try {
      const { data } = await axios.post(
        API_URL,
        {
          label: form.label.value,
          line1: form.line1.value,
          city: form.city.value,
          state: form.state.value,
          pincode: form.pincode.value,
          isDefault: form.isDefault.checked,
        },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      onSaved(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this address.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <div className="address-form__row">
        <input name="label" placeholder="Label (e.g. Home, Work)" required />
      </div>
      <input name="line1" placeholder="Street address" required />
      <div className="address-form__row">
        <input name="city" placeholder="City" required />
        <input name="state" placeholder="State" required />
      </div>
      <input name="pincode" placeholder="Pincode" required />
      <label className="address-form__checkbox">
        <input type="checkbox" name="isDefault" defaultChecked />
        Set as default address
      </label>

      {error && <p className="address-form__error">{error}</p>}

      <div className="address-form__actions">
        <button type="button" className="address-form__cancel" onClick={onCancel}>Cancel</button>
        <button type="submit" className="address-form__submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save address'}
        </button>
      </div>
    </form>
  );
}

export default AddressForm;
