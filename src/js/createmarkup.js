export function createMarkup(arr) {
    return arr.map(({webformatURL ,largeImageURL ,tags, likes, views, comments, downloads }) => ` 
    <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b class="info-item-text">Likes</b>
        <b class="info-item-js">${likes}</b>
      </p>
      <p class="info-item">
        <b class="info-item-text">Views</b>
        <b class="info-item-js">${views}</b>
      </p>
      <p class="info-item">
        <b class="info-item-text">Comments</b>
        <b class="info-item-js">${comments}</b>
      </p>
      <p class="info-item">
        <b class="info-item-text">Downloads</b>
        <b class="info-item-js">${downloads}</b>
      </p>
    </div>
  </div> `).join('')
}

