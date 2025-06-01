import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.column}>
                        <h5 className={styles.title}>О нас</h5>
                        <p className={styles.text}>Мы предлагаем широкий ассортимент качественных товаров по доступным ценам. Наша цель - сделать ваши покупки удобными и приятными.</p>
                    </div>
                    <div className={styles.column}>
                        <h5 className={styles.title}>Контакты</h5>
                        <ul className={styles.list}>
                            <li className={styles.item}>8 (918) 586-32-45</li>
                            <li className={styles.item}>NewGen@mail.ru</li>
                            <li className={styles.item}>г. Волгодонск, ул. Ленина, д. 79</li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h5 className={styles.title}>Информация</h5>
                        <ul className={styles.list}>
                            <li className={styles.item}>
                                <Link to="/delivery" className={styles.link}>Доставка</Link>
                            </li>
                            <li className={styles.item}>
                                <Link to="/payment" className={styles.link}>Оплата</Link>
                            </li>
                            <li className={styles.item}>
                                <Link to="/return" className={styles.link}>Возврат</Link>
                            </li>
                            <li className={styles.item}>
                                <Link to="/privacy" className={styles.link}>Политика конфиденциальности</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <p className={styles.copyright}>© 2025 Online Store. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 