
import './sass/_gallery.scss';
import Notiflix from 'notiflix';
import PicturesApiService from './js/fetchResult';
import LoadMoreBtn from './js/loadMoreBtn';

import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix';

const galleryEl = document.querySelector('.gallery');
const searchEl = document.querySelector('.search-form');
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});


const picturesApiService = new PicturesApiService();

searchEl.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click',  onLoadMore);


function onSearch(e) {
  e.preventDefault();
  clearPicturesList();
  picturesApiService.query = e.currentTarget.elements.searchQuery.value;
  picturesApiService.resetPage();
  // clearGallery(galleryEl);

  if (picturesApiService.query === ''){
  return Notiflix.Notify.warning('Please, print something.');
  };
  picturesApiService.fetchCart().then(hits => {
   
    if (hits.length === 0) {
      return Notiflix.Notify.failure(
        'Ooooops. Something wrong. We can`t find this. Try again, please.');
      loadMoreBtn.hide();
      return 
    }
    loadMoreBtn.show();
    loadMoreBtn.disable();
    renderList(hits);
    Notiflix.Notify.success(
      `Hooooray! We found ${picturesApiService.totalHits} perfect images for you.`
    );
    loadMoreBtn.enable();
  });

}
function onLoadMore() {
  loadMoreBtn.disable();
  picturesApiService.fetchCart().then(hits => {
    if (hits.length === 0) {
      loadMoreBtn.hide();
      return Notiflix.Notify.info(
        'We`re sorry, but you`ve reached the end of search results.'
      );
    }
    renderList(hits);
    loadMoreBtn.enable();
  });
}

function clearPicturesList(){
  galleryEl.innerHTML = '';
}

function renderList(hits) {
  const markup = hits.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads}) => {
      return `<div class="photo-card">
      <a href=${largeImageURL}>
        <img src=${webformatURL} alt=${tags} loading="lazy"  /></a>
        <div class="info">
          <p class="info-item">
             <b>Likes </b> ${likes}
           </p>
           <p class="info-item">
            <b>Views </b>${views}
          </p>
          <p class="info-item">
            <b>Comments </b>${comments}
          </p>
          <p class="info-item">
            <b>Downloads </b>${downloads}
         </p>
        </div>
          </div> `;
    })
    .join("");
    
  galleryEl.insertAdjacentHTML('beforeend', markup);

  new SimpleLightbox('.gallery a', {
    overlayOpacity: 0.8,
    captionsData: 'alt',
    captionDelay: 250,
    disableRightClick: true,
    alertError: false,
    });
    }


    
