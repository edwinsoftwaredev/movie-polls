import React from 'react';
import Spinner from '../spinners/Spinners';
import style from './Button.module.scss';

interface IButton {
  name: string;
  type: 'button' | 'submit';
  classType: 'default' | 'contained' | 'radial';
  spinnered: boolean;
  spinnerColor?: 'white' | 'red';
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  otherProps?: any
}

const Button: React.FC<IButton> = (props: IButton) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // calcback should only be called when type is button and not submit or any other
    if (props.onClick && props.type === 'button' && !props.spinnered)
      props.onClick(e);
  };

  return (
    <div className={style['button-container']}>
      <button 
        className={style[props.classType] + ' ' + (props.spinnered ? style['inactive'] : '')} 
        type={props.type}
        disabled={props.spinnered}
        onClick={handleClick}
        {...props.otherProps}
      >
        {
          !props.spinnered ? props.name : <Spinner color={props.spinnerColor ? props.spinnerColor : 'white'}/>
        }
      </button>
    </div>
  )
};

export default Button;