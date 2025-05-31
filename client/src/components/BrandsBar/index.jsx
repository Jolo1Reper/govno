import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { Context } from '../..';
import styles from './BrandsBar.module.scss';
import Button from '../../theme/Button';
import BrandsLoader from './BrandsLoader';
import { fetchBrands } from '../../http/deviceApi';

const BrandsBar = observer(({ isLoading }) => {
  const { device } = useContext(Context);
  const skeletons = [...new Array(3)].map((_, index) => (
    <li className={styles.item} key={index}>
      <BrandsLoader />
    </li>
  ));

  useEffect(() => {
    const loadBrands = async () => {
      if (device.selectedType && device.selectedType.id) {
        try {
          console.log('Загрузка брендов для типа:', device.selectedType.id);
          const brands = await fetchBrands(device.selectedType.id);
          console.log('Полученные бренды:', brands);
          device.setBrands(brands);
          device.setSelectedBrand({});
        } catch (error) {
          console.error('Ошибка при загрузке брендов:', error);
          device.setBrands([]);
        }
      } else {
        console.log('Тип не выбран, очистка брендов');
        device.setBrands([]);
        device.setSelectedBrand({});
      }
    };

    loadBrands();
  }, [device.selectedType]);

  const handleChangeBrand = (brand) => {
    if (device.selectedBrand.id === brand.id) {
      device.setSelectedBrand({});
    } else {
      device.setSelectedBrand(brand);
    }
  };

  // Если тип не выбран, не показываем бренды
  if (!device.selectedType || !device.selectedType.id) {
    return null;
  }

  // Если нет брендов для выбранного типа
  if (!isLoading && (!device.brands || device.brands.length === 0)) {
    return (
      <div className={styles.container}>
        <p className={styles.noBrands}>Нет доступных брендов для выбранного типа</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {isLoading
          ? skeletons
          : device.brands.map((brand) => (
              <li className={styles.item} key={brand.id}>
                <Button
                  className={`${brand.id === device.selectedBrand.id ? styles.active : ''}`}
                  onClick={() => handleChangeBrand(brand)}>
                  {brand.name}
                </Button>
              </li>
            ))}
      </ul>
    </div>
  );
});

export default BrandsBar;
