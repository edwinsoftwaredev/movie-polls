import React from 'react';
import { useHistory } from 'react-router';
import style from './Auth.module.scss';
import FirebaseUI from './firebaseui/FirebaseUI';

const Auth: React.FC = () => {
	const history = useHistory();
	return (
		<div className={style['auth-component']}>
			<div className={style['header']}>
				<div 
					onClick={e => history.push('/')}
					className={style['title']}
				>
					Movie Polls
				</div>
				<div className={style['subtitle']}>
					Sign In
				</div>
			</div>
			<div className={style['bg-image']}></div>
			<FirebaseUI />
		</div>
	)
};

export default Auth;