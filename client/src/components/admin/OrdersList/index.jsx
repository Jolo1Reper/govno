import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { fetchOrders, completeOrder, deleteOrder } from '../../../http/orderApi';
import Button from '../../../theme/Button';
import styles from './OrdersList.module.scss';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const OrdersList = observer(() => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await fetchOrders();
      setOrders(data);
    } catch (e) {
      setError('Ошибка при загрузке заказов');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeOrder(id);
      await loadOrders(); // Перезагружаем список заказов
    } catch (e) {
      console.error('Ошибка при выполнении заказа:', e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить этот заказ?')) return;
    try {
      await deleteOrder(id);
      await loadOrders();
    } catch (e) {
      alert('Ошибка при удалении заказа');
      console.error(e);
    }
  };

  const pendingOrders = orders.filter((order) => order.status !== 'COMPLETED');
  const completedOrders = orders.filter((order) => order.status === 'COMPLETED');

  if (isLoading) {
    return <div>Загрузка заказов...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Заказы</h1>

      <h3>Невыполненные</h3>
      {pendingOrders.length === 0 ? (
        <p>Нет невыполненных заказов</p>
      ) : (
        <div className={styles.list}>
          {pendingOrders.map((order) => (
            <div key={order.id} className={styles.order}>
              <div className={styles.orderHeader}>
                <h3 className={styles.orderId}>Заказ #{order.id}</h3>
                <span className={order.status === 'COMPLETED' ? styles.completed : styles.pending}>
                  {order.status === 'COMPLETED' ? 'Выполнен' : 'В обработке'}
                </span>
              </div>

              <div className={styles.orderInfo}>
                <div className={styles.infoRow}>
                  <span>Клиент:</span>
                  <span>{order.user?.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Телефон:</span>
                  <span>{order.phone}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Адрес:</span>
                  <span>{order.address}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Дата:</span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className={styles.devices}>
                {order.order_devices?.map((item) => (
                  <div key={item.id} className={styles.device}>
                    <span className={styles.deviceName}>{item.device?.name}</span>
                    <span className={styles.deviceCount}>x{item.count}</span>
                    <span className={styles.devicePrice}>{item.price * item.count} ₽</span>
                  </div>
                ))}
              </div>

              <div className={styles.totalPrice}>
                Итого: {order.totalPrice} ₽
              </div>

              {order.status !== 'COMPLETED' && (
                <Button
                  variant="success"
                  onClick={() => handleComplete(order.id)}
                  className={styles.completeBtn}
                >
                  Выполнить заказ
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <h3 style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowCompleted((prev) => !prev)}>
        Выполненные
        {showCompleted ? <FaChevronUp style={{ marginLeft: 8 }} /> : <FaChevronDown style={{ marginLeft: 8 }} />}
      </h3>
      {showCompleted && (completedOrders.length === 0 ? (
        <p>Нет выполненных заказов</p>
      ) : (
        <div className={styles.list}>
          {completedOrders.map((order) => (
            <div key={order.id} className={styles.order}>
              <div className={styles.orderHeader}>
                <h3 className={styles.orderId}>Заказ #{order.id}</h3>
                <span className={order.status === 'COMPLETED' ? styles.completed : styles.pending}>
                  {order.status === 'COMPLETED' ? 'Выполнен' : 'В обработке'}
                </span>
              </div>

              <div className={styles.orderInfo}>
                <div className={styles.infoRow}>
                  <span>Клиент:</span>
                  <span>{order.user?.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Телефон:</span>
                  <span>{order.phone}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Адрес:</span>
                  <span>{order.address}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Дата:</span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className={styles.devices}>
                {order.order_devices?.map((item) => (
                  <div key={item.id} className={styles.device}>
                    <span className={styles.deviceName}>{item.device?.name}</span>
                    <span className={styles.deviceCount}>x{item.count}</span>
                    <span className={styles.devicePrice}>{item.price * item.count} ₽</span>
                  </div>
                ))}
              </div>

              <div className={styles.totalPrice}>
                Итого: {order.totalPrice} ₽
              </div>

              <Button
                variant="danger"
                onClick={() => handleDelete(order.id)}
                className={styles.completeBtn}
              >
                Удалить
              </Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

export default OrdersList; 