import React from 'react';
import Spinner from '../spinners/Spinners';
import style from './Button.module.scss';

interface IButton {
  name: string;
  type: 'button' | 'submit';
  classType: 'default' | 'contained';
  spinnered: boolean
}

const Button: React.FC<IButton> = (props: IButton) => {
  return (
    <div className={style['button-container']}>
      <button className={style[props.classType]} type={props.type}>
        {
          !props.spinnered ? props.name : <Spinner />
        }
      </button>
    </div>
  )
};

export default Button;