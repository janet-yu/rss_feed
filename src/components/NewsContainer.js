import React, { Component } from 'react';
import Post from './Post';

window.onscroll = function() {
  scroll();
}

function scroll() {
  if ((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)) {
    document.querySelector('.news-container__top-btn').style.display = 'block';
  } else {
    document.querySelector('.news-container__top-btn').style.display = 'none';
  }
}

function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function NewsContainer(props) {
  return (
    <div className="news-container">
      <p id="results-number">{ props.numResults } results { props.queryString }</p>
      <ul>
        { props.posts }
      </ul>
      <button className='news-container__top-btn' onClick={ scrollToTop }>Top</button>
    </div>
  )
}


export default NewsContainer;
