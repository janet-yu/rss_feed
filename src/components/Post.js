import React from 'react';

function Post(props) {
  return (
    <div className="news-post">
      <span className="news-source">{ props.data.source }</span>
      <span className="publishing-date">{ props.data.date }</span>
      <a href={ props.data.url } target="_blank"><h2>{ props.data.headline }</h2></a>
      <p className="news-summary">{ props.data.summary }</p>
    </div>
  )
}

export default Post;
