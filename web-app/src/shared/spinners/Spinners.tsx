import React from 'react';
import style from './Spinners.module.scss';

interface ISpinner {
  color: 'red' | 'white';
}

const Spinner: React.FC<ISpinner> = (props: ISpinner) => {
  return (
  <div 
    className={style['spinner']} 
    style={{backgroundColor: props.color}}
  >
  </div>
  );
};

export default Spinner;