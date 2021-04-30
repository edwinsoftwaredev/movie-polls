import React from 'react';
import style from './PollAuthor.module.scss';

const PollAuthor: React.FC<{
  name: string | undefined, 
  photoURL: string | undefined}> = ({name, photoURL}) => {
  return (
    <div className={style['poll-author-component']}>
      <div className={style['author-photo-container']}>
        <img src={photoURL} alt={name} className={style['author-photo']} />
        <div className={style['author-petition']}>
          <div className={style['author-name']}>{name}</div>
          <div className={style['author-petition-text']}>
            would like you to participate in this poll.
          </div>
        </div>        
      </div>
    </div>
  );
};

export default PollAuthor;