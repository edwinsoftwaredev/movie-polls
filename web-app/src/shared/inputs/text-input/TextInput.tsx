import React from 'react';
import style from './TextInput.module.scss';

interface ITextInput {
  name: string;
  placeholder: string;
  otherProperties: object;
}

const TextInput: React.FC<ITextInput> = (props: ITextInput) => {
  return (
    <div className={style['text-input-container']}>
      <input
        name={props.name}
        placeholder={props.placeholder}
        {...props.otherProperties}
      />
    </div>
  );
};

export default TextInput;