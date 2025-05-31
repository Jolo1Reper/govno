import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index';
import Select from 'react-select';

import styles from './DeviceMetaSelect.module.scss';

const DeviceMetaSelect = observer(({ rootClassname, onTypeSelect }) => {
  const { device } = useContext(Context);

  return (
    <div className={`${styles.root} ${rootClassname}`}>
      <Select
        options={device.types}
        getOptionLabel={(type) => type.name}
        getOptionValue={(type) => type.id}
        onChange={onTypeSelect}
        placeholder="Выберите тип"
      />

      <Select
        options={device.brands}
        getOptionLabel={(brand) => brand.name}
        getOptionValue={(brand) => brand.id}
        onChange={(selectedOption) => device.setSelectedBrand(selectedOption)}
        placeholder="Выберите бренд"
        isDisabled={!device.selectedType.id}
        isClearable
      />
    </div>
  );
});

export default DeviceMetaSelect;
