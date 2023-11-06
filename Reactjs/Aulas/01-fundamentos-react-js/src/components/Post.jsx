import { Comment } from './Comment';
import styles from './Post.module.css';
import { Avatar } from './Avatar';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
export function Post({ author, content, publishedAt }) {
  const [comments, setComments] = useState(['Comentário muito bacana!']);
  const [newCommentValue, setNewCommentValue] = useState('');
  const publishedFormattedDate = format(
    publishedAt,
    "d 'de' LLLL 'às' HH:mm'h'",
    {
      locale: ptBR,
    }
  );

  const publishedDateToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  const handleCreateNewComment = async () => {
    event.preventDefault();
    const newComment = event.target.comment.value;
    setComments([...comments, newCommentValue]);
    setNewCommentValue('');
  };

  const handleNewCommentChange = () => {
    event.target.setCustomValidity('');
    setNewCommentValue(event.target.value);
  };

  const handleNewCommentInvalid = () => {
    event.target.setCustomValidity('Esse campo é obrigatório!');
  };

  const deleteComment = (commentToDelete) => {
    const commentsWithoutDeletetOne = comments.filter((comment) => {
      return comment !== commentToDelete;
    });

    setComments(commentsWithoutDeletetOne);
  };

  const isNewCommentEmpty = newCommentValue.length === 0;

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatarUrl} />

          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time
          title={publishedFormattedDate}
          dateTime={publishedAt.toISOString()}>
          {publishedDateToNow}
        </time>
      </header>

      <div className={styles.content}>
        {content.map((line) => {
          if (line.type === 'paragraph') {
            return <p key={line.content}>{line.content}</p>;
          } else if (line.type === 'link') {
            return (
              <p key={line.content}>
                <a href='#'>{line.content}</a>
              </p>
            );
          }
        })}
      </div>

      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe seu feedback</strong>

        <textarea
          name='comment'
          placeholder='Deixe um comentário'
          value={newCommentValue}
          onChange={() => {
            handleNewCommentChange();
          }}
          onInvalid={handleNewCommentInvalid}
          required
        />

        <footer>
          <button type='submit' disabled={isNewCommentEmpty}>
            Publicar
          </button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map((comment) => {
          return (
            <Comment
              key={comment}
              content={comment}
              onDeleteComment={deleteComment}
            />
          );
        })}
      </div>
    </article>
  );
}
