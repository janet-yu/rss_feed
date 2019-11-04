import React, { Component } from 'react';

/* TO DO
 * 1.) Abort asynchronous tasks when component unmounts...
*/

/*
  NOTES:
    - display: none does NOT unmount a component, so when I tried to setState
    - just because a component mounts, doesn't mean the API call in the
    componentDidMount function will be finished by the time another state
    change occurs, causing the component to unmount (this async call still has
    reference to the now unmounted component)

    MORE INFO: https://www.robinwieruch.de/react-warning-cant-call-setstate-on-an-unmounted-component
*/

class SourcesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      loading: true,
      sources: this.props.sources,
      filteredSources: [],
      selectedSources: this.props.selectedSources
    };

    this.matchSource = this.matchSource.bind(this);
    this.fetchSources = this.fetchSources.bind(this);
    this.handleSelectedSource = this.handleSelectedSource.bind(this);
  }

  componentDidMount() {
    console.log('mounted');
    if (!this.state.sources) { this.fetchSources() };
  }

  componentWillUnmount() {
    console.log('unmounted');
    this.props.onSelectSources(this.state.selectedSources);
  }

  async fetchSources() {
    const apiResponse = await fetch('https://newsapi.org/v2/sources?apiKey=aee03c3c3fbe4c88b553a9faba6fedd6');
    const responseJSON = await apiResponse.json();

    this.setState(prevState => {
      return {
        sources: responseJSON.sources,
        loading: false
      }

    });
  }

  handleSelectedSource(src) {
    this.setState((prevState) => {
      const selectedSourcesIds = prevState.selectedSources.map(src => src.id);
      const selectedSource = document.querySelector
      // BUG: figure out why toggling source doesn't affect temporarySelected!
      if (!prevState.selectedSources || selectedSourcesIds.indexOf(src.id) === -1) {

        console.log('prevstate: ',prevState.selectedSources);

        return {
          selectedSources: prevState.selectedSources.concat(src)
        }
      } else if (selectedSourcesIds.indexOf(src.id) !== -1) {
        return {
          selectedSources: prevState.selectedSources.filter(s => s.id !== src.id)
        }
      }
    });
  }

  removeSelectedSource(src) {
    this.setState(prevState => {
      return {
        selectedSources: prevState.selectedSources.filter(s => s.name !== src)
      }
    })
  }

  matchSource(search) {
    // 1. Filter only news sources with matching search string
    const matchedSources = this.state.sources.filter((src) => {
      return (src.name.toLowerCase().slice(0, search.length) === search.toLowerCase());
    });

    // 2. Create a list of li elements from the sources
    const sourcesList = matchedSources.map((src) => {
      return (
        <li key={ src.id } data-id={ src.id }>
            <div className='sources-modal__source-container'>
              <span className='sources-modal__source-name'>{ src.name }</span>
              <button className={ this.state.selectedSources.map(s => s.id).indexOf(src.id) === -1 ? 'sources-modal__btn' : 'sources-modal__btn selected'} onClick={(e) => {
                // need to figure out how to keep blue selected
                // BUG: NEED TO RESTART ANIMATION EVERYTIME ADDED OR REMOVED
                var popupDisplayNone;

                const popup = document.querySelector('.sources-modal__popup');
                const addedBlue = '#2C4CBC';
                const removedRed = '#EC5D5D';


                // popup.style.display = 'block';
// BUG: ANIMATION WONT BEHAVE PROPERLY >:[
                e.preventDefault();
                if (this.state.selectedSources.length === 20) {
                  popup.innerHTML = 'Cannot select more than 20 sources';
                  popup.style.color = removedRed;
                  popup.style.boxShadow = `0 0 10px ${removedRed}`;
                }
                else {
                  if (e.target.innerHTML === 'Select') {
                      e.target.innerHTML = 'Remove';
                      e.target.style.backgroundColor = `${removedRed}`;
                      popup.innerHTML = `Added "${src.name}" to your news sources list!`;
                      popup.style.color = addedBlue;
                      popup.style.boxShadow = `0 0 10px ${addedBlue}`;
                  } else {
                    e.target.innerHTML = 'Select';
                    e.target.style.backgroundColor = `${addedBlue}`;
                    popup.innerHTML = `Removed "${src.name}" from your news sources list.`;
                    popup.style.color = removedRed;
                    popup.style.boxShadow = `0 0 10px ${removedRed}`;
                  }
                  this.handleSelectedSource({id: src.id, name: e.target.previousSibling.innerHTML})
                }
                popup.classList.remove('animate');
                void popup.offsetWidth; // reset animation
                popup.classList.add('animate');
                }}>
                {this.state.selectedSources.map(s => s.id).indexOf(src.id) === -1 ? 'Select' : 'Remove'}
              </button>
            </div>
        </li>
      )
    });

    this.setState((currState) => {
      return {
        searchValue: search,
        filteredSources: sourcesList
      }
    })
  }

  returnModalPlaceholder() {
    const selectedSourcesList = this.state.selectedSources.map(src => {
      return (<div key={ src.id } className='selected-source_container'>
        <span className='selected-source__name'>{src.name}</span>
        <button className='selected-source__remove-btn' onClick={(e) => {
          const srcName = e.target.previousSibling;
          this.removeSelectedSource(srcName.innerHTML);
        }}>Remove</button>
        </div>)
    });

    const modalPlaceholder = (this.state.selectedSources.length ?
      <div className='sources-modal__selected-srcs'>
        <span id='hi'><h2 id='selected-srcs__title'>Your selected news sources</h2></span>
        {selectedSourcesList}
      </div>
      :
      (<div className='sources-modal__svg-container'>
        <img id='newspaper-icon' src={process.env.PUBLIC_URL + '/newspaper.svg'} />
        <h3>Search through hundreds of news sources</h3>
      </div>));

    return modalPlaceholder;
  }

  removeSourcesList() {
      const sourcesModalElement = document.querySelector('.sources-modal__list');
      sourcesModalElement.removeChild(sourcesModalElement.childNodes[1]);
      sourcesModalElement.appendChild(this.returnModalPlaceholder());
  }

  onGotoNewsSources() {
    this.setState(prevState => {
      return {
        searchValue: ''
      }
    })
  }

  render() {
    console.log('SourcesModal selectedSources: ', this.state.selectedSources);

    const modalPlaceholder = this.returnModalPlaceholder();

    return (
      <div className='sources-modal'>
        <div className='sources-modal__container'>
          <div className='sources-modal__header'>
            <h2>SEARCH FOR NEWS SOURCES</h2>
            <button id='sources-modal__close'
              onClick={ () => {
                const popup = document.querySelector('.sources-modal__popup');
                popup.classList.remove('animate');
                this.setState(prevState => {
                  return {
                    searchValue: ''
                  }
                });
                this.props.onClose();
              } }>
              <i className="fa fa-close" aria-hidden="true"></i>
            </button>
          </div>
          <div className='sources-modal__list'>
            <input
              id='sources-modal__searchbar'
              type='text'
              placeholder='Ex: BBC News'
              onChange={(e) => {
                this.matchSource(e.target.value) }
              }
              value={this.state.searchValue}
            />
            {this.state.searchValue ? <button className='sources-modal__news-sources-btn' onClick={() => {this.onGotoNewsSources()}}>◀ See your selected news sources</button> : ''}
            {this.state.searchValue ?
              <div className='sources-modal__results-container'>
                <ul id='sources-modal__sources-results'>
                  {this.state.filteredSources}
                </ul>

              </div>
               :
              modalPlaceholder}
          </div>
            <div className='sources-modal__popup'>
            <button className='sources-modal__news-sources-btn' onClick={() => {this.onGotoNewsSources()}}>◀ See your selected news sources</button>
            </div>
        </div>
      </div>
    )
  }
}

export default SourcesModal;
