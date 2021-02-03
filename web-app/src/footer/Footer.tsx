import React from 'react';
import style from './Footer.module.scss';

const Footer: React.FC = () => {
	return (
		<div className={style['footer-component']}>
			<div className={style['app-title']}>
				Movie Polls
			</div>
		</div>
	);
};

export default Footer;