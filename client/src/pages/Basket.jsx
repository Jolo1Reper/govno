import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import BasketDevicesList from '../components/basket/BasketDevicesList';
import { fetchBasketDevices } from '../http/basketApi';
import BasketBottom from '../theme/BasketInfo';
import NoItems from '../theme/NoItems';
import OrderForm from '../components/basket/OrderForm';

const Basket = observer(() => {
  const { basket, user } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user.isAuth) {
      fetchBasketDevices(user.userId)
        .then((data) => {
          basket.setBasketDevices(data);
          basket.setBasketTotalPositions(data.length);
        })
        .catch((e) => {
          alert('Ошибка при получении корзины');
          console.log(e);
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

  const handleOrderComplete = () => {
    basket.clearBasket();
  };

  if (!basket.basketTotalPositions && !isLoading) {
    return (
      <div className="container">
        <NoItems
          title="Корзина пуста =("
          desc="Добавьте хотя бы 1 товар в корзину и возвращайтесь снова!"
        />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Корзина</h1>
      <BasketDevicesList isLoading={isLoading} />
      {basket.basketDevices.length > 0 && (
        <OrderForm onOrderComplete={handleOrderComplete} />
      )}
      <BasketBottom
        totalPrice={basket.basketTotalPrice}
        totalCount={basket.basketTotalCount}
        totalPositions={basket.basketTotalPositions}
        isLoading={isLoading}
      />
    </div>
  );
});

export default Basket;
