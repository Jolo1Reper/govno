import { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import Button from '../../theme/Button';
import styles from './CommentsList.module.scss';
import { createComment, deleteComment, fetchComments } from '../../http/commentApi';
import { ADMIN_ROLE } from '../../utils/consts';

const CommentsList = observer(({ deviceId, comments: initialComments, userRating }) => {
  const { user } = useContext(Context);
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await fetchComments(deviceId);
        setComments(data || []);
      } catch (e) {
        console.error('Ошибка при загрузке комментариев:', e);
        setError('Ошибка при загрузке комментариев');
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [deviceId]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!newComment.trim()) return;
      
      setIsLoading(true);
      setError('');
      const comment = await createComment({
        deviceId,
        text: newComment,
        rating: userRating
      });
      
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (e) {
      console.error('Ошибка при добавлении комментария:', e);
      setError('Ошибка при добавлении комментария');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      setIsLoading(true);
      setError('');
      await deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (e) {
      console.error('Ошибка при удалении комментария:', e);
      setError('Ошибка при удалении комментария');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Комментарии</h3>
      
      {user.isAuth && userRating ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Оставьте свой комментарий..."
            className={styles.textarea}
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || !newComment.trim()}
            className={styles.submitBtn}
          >
            {isLoading ? 'Отправка...' : 'Отправить'}
          </Button>
        </form>
      ) : user.isAuth ? (
        <p className={styles.notice}>Оцените устройство, чтобы оставить комментарий</p>
      ) : (
        <p className={styles.notice}>Войдите, чтобы оставить комментарий</p>
      )}

      <div className={styles.list}>
        {isLoading && comments.length === 0 ? (
          <p className={styles.loading}>Загрузка комментариев...</p>
        ) : comments.length === 0 ? (
          <p className={styles.noComments}>Пока нет комментариев</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentHeader}>
                <span className={styles.userName}>{comment.user?.email || 'Пользователь'}</span>
                <span className={styles.rating}>Оценка: {comment.rating}</span>
                {(user.userRole === ADMIN_ROLE || user.userId === comment.userId) && (
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(comment.id)}
                    disabled={isLoading}
                    className={styles.deleteBtn}
                  >
                    Удалить
                  </Button>
                )}
              </div>
              <p className={styles.commentText}>{comment.text}</p>
              <span className={styles.date}>
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

export default CommentsList; 