import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPoll } from '../../../../services/epics/polls';
import { pollsSelector } from '../../../../services/slices-selectors/polls';
import Button from '../../../button/Button';
import TextInput from '../../../inputs/text-input/TextInput';
import style from './PollForm.module.scss';

interface IPollForm {
  movieId: number;
}

const PollForm: React.FC<IPollForm> = (props: IPollForm) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const polls = useSelector(pollsSelector);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setSubmitted(true);
    dispatch(setPoll({
      name: name,
      movies: [{
        movieId: props.movieId
      }]
    }));
    e.preventDefault();
  };

  useEffect(() => {
    setSubmitted(false);
  }, [polls]);

  return (
    <Fragment>
      <div className={style['header']}>
        Create a New Poll
      </div>
      <form
        className={style['new-poll-form']}
        onSubmit={e => submitted ? null : handleSubmit(e)}
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
          spinnered={submitted}
        />
      </form>
    </Fragment>
  );
};

export default PollForm;