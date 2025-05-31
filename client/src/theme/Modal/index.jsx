import { useEffect } from 'react';
import Portal from '../../components/Portal';
import Button from '../Button';
import styles from './Modal.module.scss';

const Modal = ({ show, onHide, title, children }) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  return (
    <Portal>
      <div className={styles.overlay} onClick={onHide}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <Button variant="danger" onClick={onHide} className={styles.closeBtn}>
              ✕
            </Button>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal; 