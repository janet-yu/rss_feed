import React, { Component } from 'react';

// Components
import Loader from './components/Loader';
import Header from './components/Header';
import Post from './components/Post';
import NewsContainer from './components/NewsContainer';
import SourcesModal from './components/SourcesModal';

class App extends Component {
  constructor() {
    super();
    this.APIkey = 'aee03c3c3fbe4c88b553a9faba6fedd6';
    this.state = {
      loading: true,
      newsType: 'top-headlines', // default type
      country: 'us',
      query: '',
      selectedSources: [],
      posts: [], // list of news objects
      modalVisible: false
    }

    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.fetchArticles = this.fetchArticles.bind(this);
    this.addSelectedSources = this.addSelectedSources.bind(this);
    this.removeSelectedSource = this.removeSelectedSource.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.fetchArticles();
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.query !== this.state.query && (this.state.selectedSources.length !== 0 || this.state.newsType === 'top-headlines'))
        || (prevState.newsType === 'everything' && this.state.newsType === 'top-headlines')
        || (prevState.newsType === 'top-headlines' && this.state.newsType === 'everything' && (this.state.selectedSources.length !== 0 || this.state.query))
        || (prevState.selectedSources !== this.state.selectedSources && this.state.query)
        || (this.state.selectedSources.length !== 0 && (prevState.selectedSources !== this.state.selectedSources && this.state.newsType === 'everything'))) {
      this.fetchArticles();
    }
  }

  componentWillUnmount() {
    console.log('unmounted');
  }

  async fetchArticles() {
    const query = this.state.query ? `q=${this.state.query}&` : '';
    const country = this.state.newsType === 'top-headlines' ? `country=${this.state.country}&` : '';
    const sourcesIds = this.state.selectedSources.map(src => src.id);
    const sources = (this.state.selectedSources.length !== 0 && this.state.newsType === 'everything') ? `sources=${sourcesIds.join(',')}&` : '';

    this.setState(prevState => {
      return { loading: true }
    })

    const response = await fetch (`https://newsapi.org/v2/${this.state.newsType}?${query}${country}${sources}pageSize=100&apiKey=${this.APIkey}`);
    const responseJSON = await response.json();

    this.setState(prevState => {
      return {
        posts: responseJSON.articles,
        loading: false
      }
    })
  }

  handleSearch(q) {
    this.setState((prevState) => {
      return {
        query: q
      }
    });
  }

  handleSelect(type) {
    this.setState((prevState) => {
      return {
        newsType: type
      }
    })
  }

  removeSelectedSource(src) {
    this.setState(prevState => {
      return {
        selectedSources: prevState.selectedSources.filter(s => s.name !== src) // all sources except src param
      }
    })
  }

  addSelectedSources(srcs) {
    this.setState(prevState => {
      return {
        selectedSources: srcs
      }
    })
  }

  clearSearch() {
    document.querySelector('#searchbar').value = '';
    this.setState(prevState => {
      return {
        query: ''
      }
    })
  }

  closeModal() {
    this.setState(prevState => {
      return {
        modalVisible: false
      }
    })
  }

  render() {
    // Disable scrolling when the sources modal pops up
    if (this.state.modalVisible === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    if (this.state.loading === false)
    {
      const newsList = this.state.posts.sort((articleA, articleB) => {
        if (articleA.publishedAt < articleB.publishedAt) {
          return 1;
        } else if (articleA.publishedAt > articleB.publishedAt) {
          return -1;
        }
        return 0;
      }).map((obj, i) => {
        return (
          <Post
            key={i}
            data={
              {
                source: obj.source.name,
                headline: obj.title,
                summary: obj.description,
                url: obj.url,
                date: obj.publishedAt.slice(0, 10)
              }
            }
          />
        )
      });
      return (
          <div className="App">
            <Header
              onSearch={this.handleSearch}
              onSelect={this.handleSelect}
              onClear ={this.clearSearch}
            />
            {(this.state.newsType === 'everything') ?
              (<div>
                <button className="source-select" onClick={() => {
                  this.setState(prevState => {
                    return { modalVisible: true }
                  });
                }}>{ this.state.selectedSources.length ? 'Your News Sources' : 'Choose News Sources' }</button>
                {this.state.modalVisible ?
                  <SourcesModal
                    onSelectSources={this.addSelectedSources}
                    onRemoveSource={this.removeSelectedSource}
                    selectedSources={this.state.selectedSources}
                    onClose={this.closeModal}
                  /> : ''
                }

              </div>) : ''
            }
            <div className="container">
              <NewsContainer
                posts={newsList}
                numResults={newsList.length}
                queryString={this.state.query ? `for '${this.state.query}'` : ''}/>
            </div>
          </div>
      );
    }
    else {
      return (
        <div className="App">
          <Header />
          <div className="container">
            <Loader />
          </div>
        </div>
      )
    }
  }
}



export default App;
