import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userAuthenticationStatusSelector } from '../auth/auth-selectors';
import { USER_AUTHENTICATION_STATUS } from '../shared/utils/enums';
import style from './Footer.module.scss';

const Footer: React.FC = () => {
  const userAuthStatus = useSelector(userAuthenticationStatusSelector);

  if (userAuthStatus === USER_AUTHENTICATION_STATUS.NOT_FETCHED) {
    return null;
  }
  
	return (
		<div id='footer' className={style['footer-component']}>
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