import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPoll } from '../../../../services/epics/polls';
import Button from '../../../button/Button';
import TextInput from '../../../inputs/text-input/TextInput';
import style from './PollForm.module.scss';

interface IPollForm {
  movieId: number;
}

const PollForm: React.FC<IPollForm> = (props: IPollForm) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    dispatch(setPoll({
      name: name,
      movies: [{
        movieId: props.movieId
      }]
    }));
    e.preventDefault();
  };

  return (
    <Fragment>
      <div className={style['header']}>
        Create a New Poll
      </div>
      <form
        className={style['new-poll-form']}
        onSubmit={handleSubmit}
      >
        <TextInput
          name={'poll-name'}
          clbk={value => setName(value)}
          placeholder={'Type the name of the new poll'}
          otherProperties={{
            required: 'required',
            autoComplete: 'off',
            pattern: '[0-9A-Za-z\\s]+'
          }}
        />
        <Button
          name={'Add To A New Poll'}
          type={"submit"}
          classType={"default"}
        />
      </form>
    </Fragment>
  );
};

export default PollForm;