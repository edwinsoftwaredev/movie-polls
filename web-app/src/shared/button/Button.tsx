import React from 'react';
import style from './Button.module.scss';

interface IButton {
  name: string;
  type: 'button' | 'submit';
  classType: 'default' | 'contained';
}

const Button: React.FC<IButton> = (props: IButton) => {
  return (
    <div className={style['button-container']}>
      <button className={style[props.classType]} type={props.type}>
        {props.name}
      </button>
    </div>
  )
};

export default Button;