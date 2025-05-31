import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../../../index';
import { createDevice, fetchBrands, fetchTypes } from '../../../http/deviceApi';
import Modal from '../../Modal';
import styles from './modals.module.scss';
import Button from '../../../theme/Button';
import DeviceMetaSelect from '../DeviceMetaSelect';
import DeviceInfoBlock from '../DeviceInfoBlock';
import Input from '../../../theme/Input';
import Textarea from '../../../theme/Textarea';

const CreateDevice = observer(({ opened, onClose }) => {
  const { device } = useContext(Context);
  const [info, setInfo] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [files, setFiles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      fetchTypes().then((data) => device.setTypes(data));
    } catch (error) {
      console.log(error);
      alert('Ошибка при загрузке типов');
    }
  }, []);

  const handleTypeSelect = async (selectedType) => {
    device.setSelectedType(selectedType);
    if (selectedType) {
      try {
        const brands = await fetchBrands(selectedType.id);
        device.setBrands(brands);
      } catch (error) {
        console.log(error);
        alert('Ошибка при загрузке брендов для выбранного типа');
      }
    } else {
      device.setBrands([]);
    }
    device.setSelectedBrand({});
  };

  const addInfo = () => {
    setInfo([...info, { title: '', description: '', number: Date.now() }]);
  };

  const removeInfo = (number) => {
    setInfo(info.filter((i) => i.number !== number));
  };

  const changeInfo = (key, value, number) => {
    setInfo(info.map((i) => (i.number === number ? { ...i, [key]: value } : i)));
  };

  const selectFile = (e) => {
    setFiles(e.target.files);
  };

  const addDevice = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!device.selectedBrand.id || !device.selectedType.id) {
      alert('Выберите бренд и тип');
      return;
    }

    if (!price || price <= 0) {
      alert('Введите корректную цену');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    const total = {
      properties: info,
      propertiesWithVariants: []
    };

    formData.append('name', name);
    formData.append('price', `${price}`);
    formData.append('brandId', device.selectedBrand.id);
    formData.append('typeId', device.selectedType.id);
    formData.append('info', JSON.stringify(total));
    formData.append('description', desc);

    for (let i = 0; i < files.length; i++) {
      formData.append('img', files[i]);
    }

    createDevice(formData)
      .then(() => {
        onClose();
      })
      .catch((e) => {
        alert('Ошибка при создании устройства');
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal opened={opened} onClose={onClose}>
      <h2>Добавить устройство</h2>
      <form className={styles.form} onSubmit={addDevice}>
        <DeviceMetaSelect rootClassname={styles.select} onTypeSelect={handleTypeSelect} />
        <div className={styles.inputsBlock}>
          <Input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Введите название устройства"
            required={true}
          />
          <Input
            className={styles.input}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            type="number"
            placeholder="Введите стоимость устройства"
            required={true}
            min="1"
          />
          <Textarea
            className={styles.input}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Введите описание устройства"
            required={true}
          />
          <input type="file" onChange={selectFile} multiple required />
        </div>

        <Button type="button" onClick={addInfo}>
          Добавить новое свойство
        </Button>

        {info.map((i) => (
          <DeviceInfoBlock
            key={i.number}
            number={i.number}
            title={i.title}
            description={i.description}
            changeInfo={changeInfo}
            removeInfo={removeInfo}
          />
        ))}

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
});

export default CreateDevice;
