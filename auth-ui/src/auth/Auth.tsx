import React from 'react';
import style from './Auth.module.scss';
import FirebaseUI from './firebaseui/FirebaseUI';

const Auth: React.FC = () => {
	return (
		<div className={style['auth-component']}>
			<div className={style['header']}>
				<div className={style['title']}>
					Movie Polls 🎬
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