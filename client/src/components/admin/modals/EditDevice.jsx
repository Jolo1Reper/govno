import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Button from '../../../theme/Button';
import Modal from '../../../theme/Modal';
import styles from './Modal.module.scss';
import { updateDevice } from '../../../http/deviceApi';

const EditDevice = observer(({ show, onHide, device, onUpdate }) => {
  const [name, setName] = useState(device.name);
  const [price, setPrice] = useState(device.price);
  const [description, setDescription] = useState(device.description);
  const [info, setInfo] = useState(device.info || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(device.name);
    setPrice(device.price);
    setDescription(device.description);
    setInfo(device.info || []);
  }, [device]);

  const addInfo = () => {
    setInfo([...info, { title: '', description: '', id: Date.now() }]);
  };

  const removeInfo = (id) => {
    setInfo(info.filter(i => i.id !== id));
  };

  const changeInfo = (key, value, id) => {
    setInfo(info.map(i => i.id === id ? { ...i, [key]: value } : i));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('info', JSON.stringify(info));

      const updatedDevice = await updateDevice(device.id, formData);
      onUpdate(updatedDevice);
      onHide();
    } catch (e) {
      alert('Ошибка при обновлении устройства');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} title="Редактировать устройство">
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название устройства"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Цена устройства"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className={styles.input}
        />
        <textarea
          placeholder="Описание устройства"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
        />
        
        <div className={styles.characteristics}>
          <h3 className={styles.characteristicsTitle}>Характеристики:</h3>
          <Button
            type="button"
            variant="outline"
            onClick={addInfo}
            className={styles.addCharBtn}
          >
            Добавить характеристику
          </Button>
          
          {info.map(item => (
            <div key={item.id} className={styles.charItem}>
              <input
                type="text"
                placeholder="Название характеристики"
                value={item.title}
                onChange={(e) => changeInfo('title', e.target.value, item.id)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Описание характеристики"
                value={item.description}
                onChange={(e) => changeInfo('description', e.target.value, item.id)}
                className={styles.input}
              />
              <Button
                type="button"
                variant="danger"
                onClick={() => removeInfo(item.id)}
                className={styles.removeCharBtn}
              >
                Удалить
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="submit"
          variant="primary"
          className={styles.submitBtn}
          disabled={isLoading}>
          {isLoading ? 'Обновление...' : 'Обновить'}
        </Button>
      </form>
    </Modal>
  );
});

export default EditDevice; 