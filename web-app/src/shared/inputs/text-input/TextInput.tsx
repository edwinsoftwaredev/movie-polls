import React from 'react';
import style from './TextInput.module.scss';

interface ITextInput {
  name: string;
  placeholder: string;
  otherProperties: object;
  clbk: (value: string) => void
}

const TextInput: React.FC<ITextInput> = (props: ITextInput) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.clbk(e.target.value);
  };

  return (
    <div className={style['text-input-container']}>
      <input
        type='text'
        onChange={handleChange}
        name={props.name}
        placeholder={props.placeholder}
        {...props.otherProperties}
      />
    </div>
  );
};

export default TextInput;