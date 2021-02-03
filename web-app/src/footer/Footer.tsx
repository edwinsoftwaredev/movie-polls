import React from 'react';
import { Link } from 'react-router-dom';
import style from './Footer.module.scss';

const Footer: React.FC = () => {
	return (
		<div className={style['footer-component']}>
			<div className={style['app-title']}>
				Movie Polls
			</div>
			<div className={style['footer-columns']}>
        <div className={style['column']}>
          <div className={style['header']}>App</div>
          <div className={style['links']}>
            <Link to='/'>About</Link>
            <Link to='/'>Contact</Link>
          </div>
        </div>
      </div>
		</div>
	);
};

export default Footer;