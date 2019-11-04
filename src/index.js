import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

document.getElementById('searchbar').addEventListener('keyup', function(e) {
  if (e.keyCode === 13) {
    // Cancel the default action, if needed
    e.preventDefault();
    // Trigger the button element with a click
    document.getElementById("search-button").click();
  }
});
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
