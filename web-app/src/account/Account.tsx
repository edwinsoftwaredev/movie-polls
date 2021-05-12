import React, { useEffect, useState } from 'react';
import { getUser } from '../firebase-config';
import style from './Account.module.scss';
import firebase from 'firebase';
import Axios from 'axios';
import Spinner from '../shared/spinners/Spinners';

const Account: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = () => {
    const deleteAccount = async () => {
      const res = await Axios.post(`${process.env.REACT_APP_API_SERVER}/api/account/delete`);
      if (res.status === 204) {
        const user = firebase.auth().currentUser;
        user && user.delete();
      }
    }

    setDeleting(true);
    deleteAccount()
  }

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <div className={style['sliders-container']}>
      <div className={style['account-component']}>
        {
          user ? (
            <div className={style['user-data']}>
              <div className={style['profile-pic']}>
                <img 
                  alt={user.displayName ?? ''} 
                  src={user.photoURL ?? '#'}
                />
              </div>
              <div className={style['profile-options']}>
                <div className={style['profile-name']}>
                  {user.displayName}
                </div>
                <div className={style['options']}>
                  <button 
                    onClick={handleDeleteAccount}
                    className={style['delete-account-btn']}
                  >
                    {deleting ? <Spinner color={'red'} /> : 'Delete Account'}
                  </button>
                </div>
              </div>
            </div>
          ) : null
        }
      </div>
    </div>
  );
};

export default Account;