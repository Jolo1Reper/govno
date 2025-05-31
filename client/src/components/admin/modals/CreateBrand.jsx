import { useState, useContext, useEffect } from 'react';
import { createBrand, fetchTypes } from '../../../http/deviceApi';
import { Context } from '../../../index';
import Modal from '../../Modal';
import styles from './modals.module.scss';
import Button from '../../../theme/Button';
import Input from '../../../theme/Input';
import Select from 'react-select';

const CreateBrand = ({ opened, onClose }) => {
  const { device } = useContext(Context);
  const [value, setValue] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTypes().then(data => device.setTypes(data));
  }, []);

  const addBrand = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!value) {
      alert('Введите название бренда!');
      return;
    }

    if (!selectedTypes.length) {
      alert('Выберите хотя бы один тип устройства!');
      return;
    }

    createBrand({ 
      name: value,
      typeIds: selectedTypes.map(type => type.id)
    })
      .then(() => {
        setValue('');
        setSelectedTypes([]);
        onClose();
      })
      .catch((e) => {
        alert('Ошибка при создании бренда!');
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal opened={opened} onClose={onClose}>
      <h2>Добавить бренд</h2>
      <form className={styles.form} onSubmit={addBrand}>
        <div className={styles.inputsBlock}>
          <Input
            className={styles.input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            placeholder="Введите название бренда"
            required={true}
          />
          <Select
            isMulti
            options={device.types}
            value={selectedTypes}
            onChange={setSelectedTypes}
            getOptionLabel={(type) => type.name}
            getOptionValue={(type) => type.id}
            placeholder="Выберите типы устройств"
            className={styles.select}
          />
        </div>

        <div className={styles.footer}>
          <Button type="submit" isLoading={isLoading}>
            Добавить
          </Button>
          <Button variant="danger" className={styles.closeBtn} onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateBrand;
