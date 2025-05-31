import { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../..';
import AddToBasketBtn from '../../../theme/AddToBasketBtn';
import RatingComponent from '../../rating/RatingComponent';
import { Link } from 'react-router-dom';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { LOGIN_ROUTE, ADMIN_ROLE } from '../../../utils/consts';
import SelectorContainer from '../../selector/SelectorContainer';
import EditDevice from '../../admin/modals/EditDevice';
import CommentsList from '../../comments/CommentsList';
import { fetchComments } from '../../../http/commentApi';
import Button from '../../../theme/Button';

import 'swiper/css';
import 'swiper/css/pagination';
import styles from './DevicePageComponent.module.scss';

const DevicePageComponent = observer(
  ({
    name,
    price,
    rating,
    photos = [],
    info = [],
    id,
    description,
    addDeviceToBasket,
    isBasketUpdating,
    userRate,
    onUpdate,
  }) => {
    const [localDeviceRating, setLocalDeviceRating] = useState(rating ? Number(rating) : 0);
    const [localRate, setLocalRate] = useState(userRate);
    const [selectedVariant, setSelectedVariant] = useState([]);
    const [isDeviceAdded, setIsDeviceAdded] = useState(false);
    const [localPrice, setLocalPrice] = useState(price);
    const [showEditModal, setShowEditModal] = useState(false);
    const [comments, setComments] = useState([]);
    const [isCommentsLoading, setIsCommentsLoading] = useState(true);
    const { user, basket } = useContext(Context);

    useEffect(() => {
      const loadComments = async () => {
        try {
          const data = await fetchComments(id);
          setComments(data || []);
        } catch (e) {
          console.error('Ошибка при загрузке комментариев:', e);
          setComments([]);
        } finally {
          setIsCommentsLoading(false);
        }
      };

      loadComments();
    }, [id]);

    const checkDeviceInBasket = () => {
      const basketItemVariants = basket?.basketDevices?.filter((item) => item.device.id === +id) || [];

      if (!basketItemVariants.length || !selectedVariant.length) {
        setIsDeviceAdded(basket?.basketDevices?.some((item) => item.device.id === +id) || false);
      } else {
        const variantsId = selectedVariant.map((variant) => variant.id);
        const basketVariantsId = [];

        basketItemVariants.forEach((item) => {
          if (item.variants && item.variants.length) {
            item.variants.forEach((variant) => {
              basketVariantsId.push(variant.device_variant.id);
            });
          }
        });

        setIsDeviceAdded(variantsId.every((variantId) => basketVariantsId.includes(variantId)));
      }
    };

    useEffect(() => {
      const initVariants = [];

      if (Array.isArray(info)) {
        info.forEach((item) => {
          if (item?.variants?.length) {
            initVariants.push({ id: item.variants[0].id, infoId: item.id });
          }
        });
      }

      setSelectedVariant(initVariants);
      checkDeviceInBasket();
    }, [info]);

    useEffect(() => {
      checkDeviceInBasket();
    }, [selectedVariant, basket?.basketDevices]);

    const setVariantsObj = (infoId, id) => {
      const item = selectedVariant.find((variant) => variant.infoId === infoId);

      if (item) {
        setSelectedVariant((prev) =>
          prev.map((variant) => (variant.infoId === infoId ? { ...variant, id } : variant)),
        );
      } else {
        setSelectedVariant([...selectedVariant, { infoId, id }]);
      }
    };

    return (
      <div className={styles.container}>
        <div className={styles.top}>
          <span className={styles.wrapper}>
            <Swiper modules={[Pagination]} slidesPerView={1} pagination={{ clickable: true }}>
              {photos.map((photo) => (
                <SwiperSlide key={photo.id}>
                  <img
                    className={styles.topImg}
                    src={`${process.env.REACT_APP_API_URL}/${photo.url}`}
                    alt={name}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </span>
          <div className={styles.topRatingBlock}>
            <h2 className={styles.title}>{name}</h2>
            <div className={styles.rating}>
              Рейтинг: <span>{localDeviceRating ? localDeviceRating.toFixed(1) : '0.0'}</span>
            </div>
            {user?.isAuth ? (
              <div className={styles.rate}>
                <h3>Ваша оценка: {localRate}</h3>
                <RatingComponent
                  rate={localRate}
                  setRate={setLocalRate}
                  deviceId={id}
                  setLocalRating={setLocalDeviceRating}
                  edit={user.isAuth}
                />
              </div>
            ) : (
              <div>
                <Link to={LOGIN_ROUTE}>Войдите</Link> что бы оценить
              </div>
            )}
            <p className={styles.desc}>{description}</p>
          </div>
          <div>
            <h3 className={styles.price}>{localPrice} Руб.</h3>
            <AddToBasketBtn
              isAuth={user?.isAuth}
              isLoading={isBasketUpdating}
              isAdded={isDeviceAdded}
              onAddToBasket={() => addDeviceToBasket(selectedVariant, checkDeviceInBasket)}
              className={styles.addToBasketBtn}
            />
            {user?.userRole === ADMIN_ROLE && (
              <Button
                variant="primary"
                onClick={() => setShowEditModal(true)}
                className={styles.editBtn}
              >
                Редактировать
              </Button>
            )}
            {Array.isArray(info) && info.map((item) =>
              item?.variants?.length ? (
                <SelectorContainer
                  key={item.id}
                  infoId={item.id}
                  {...item}
                  setGlobalState={setVariantsObj}
                  setPrice={setLocalPrice}
                  price={price}
                  className={styles.selector}
                />
              ) : null,
            )}
          </div>
        </div>
        <div className={styles.chars}>
          <h2 className={styles.charsTitle}>Характеристики</h2>
          {Array.isArray(info) && info.map((item) => (
            <div key={item.id} className={styles.infoItem}>
              <span className={styles.infoTitle}>{item.title} : </span>
              {item?.variants?.length > 0 ? (
                item.variants.map((variant) =>
                  variant?.colorHex ? (
                    <span
                      key={variant.id}
                      className={`${styles.infoVariant} ${styles.infoColorWrapper}`}>
                      <span
                        style={{ backgroundColor: variant.colorHex }}
                        className={styles.infoColor}></span>
                      {variant.value}
                    </span>
                  ) : (
                    <span key={variant.id} className={styles.infoVariant}>
                      {variant.value}
                    </span>
                  ),
                )
              ) : (
                <span className={styles.infoDesc}>{item.description}</span>
              )}
            </div>
          ))}
        </div>

        <CommentsList
          deviceId={id}
          comments={comments}
          userRating={localRate}
        />

        {showEditModal && (
          <EditDevice
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            device={{ id, name, price, description, info }}
            onUpdate={onUpdate}
          />
        )}
      </div>
    );
  },
);

export default DevicePageComponent;
