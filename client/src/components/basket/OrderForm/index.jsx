import { useState } from 'react';
import Button from '../../../theme/Button';
import styles from './OrderForm.module.scss';
import { createOrder } from '../../../http/orderApi';

const OrderForm = ({ onOrderComplete }) => {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!phone.trim() || !address.trim()) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      setIsLoading(true);
      await createOrder({ phone, address });
      setPhone('');
      setAddress('');
      setError('');
      setSuccess(true);
      onOrderComplete();
    } catch (e) {
      setError(e.response?.data?.message || 'Произошла ошибка при создании заказа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.title}>Оформление заказа</h3>
      {success && <div className={styles.success}>Ваш заказ принят в обработку</div>}
      {!success && error && <div className={styles.error}>{error}</div>}
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Номер телефона"
        className={styles.input}
        disabled={isLoading}
      />
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Адрес доставки"
        className={styles.input}
        disabled={isLoading}
      />
      <Button
        type="submit"
        variant="primary"
        className={styles.submitBtn}
        disabled={isLoading}
      >
        {isLoading ? 'Оформление...' : 'Оформить заказ'}
      </Button>
    </form>
  );
};

export default OrderForm; 