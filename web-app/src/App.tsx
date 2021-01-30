import React from 'react';
import logo from './logo.svg';
import style from './App.module.scss';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Auth from './auth/Auth';

function App() {
  return (
    <Router>
      <Route exact path='/'>
        <div className={style["App"]}>
          <header className={style["App-header"]}>
            <img src={logo} className={style["App-logo"]} alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
              className={style["App-link"]}
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </Route>
      <Route path='/auth'>
        <Auth />
      </Route>
    </Router>
  );
}

export default App;
