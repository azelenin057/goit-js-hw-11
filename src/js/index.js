import { PixabayAPI } from "./pixabay.js";
import { createMarkup } from "./createMarkup.js";
const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('.js-searh-form'),
    searchBtn: document.querySelector('.search-btn'),
    list: document.querySelector('.gallery'),
    anchor: document.querySelector('.target-element'),
}
const {form, searchBtn, list, input, anchor} = refs;

const pixabayAPI = new PixabayAPI(40);



form.addEventListener('submit', handleSubmit)

function handleSubmit(event) {
    event.preventDefault();
    pixabayAPI.page = 1;

    const searchQuery = event.target.elements["searchQuery"].value.trim();
    if(!searchQuery) {  
        list.innerHTML = "";
        return alert("Sorry, there are no images matching your search query. Please try again.");  //В БУДУЩЕМ ЗАМЕНИТЬ НА НОТИФИКС
    }

    pixabayAPI.q = searchQuery;


    async function renderPage() {
        try {
            
            const response = await pixabayAPI.getPhotos();
            console.log(response.data.total > pixabayAPI.perPage);
            if(response.data.hits.length === 0) {
                list.innerHTML = "";
                alert('Ничего не найдено')
                console.log(response.data.total > pixabayAPI.perPage);
            }

            if (pixabayAPI.page === 1) {
                list.innerHTML = "";
            }
            if (response.data.total > pixabayAPI.perPage) {
                observer.observe(anchor);
            }

            list.insertAdjacentHTML("beforeend", createMarkup(response.data.hits))

            let pageSum = Math.ceil(response.data.total/40);
            
            if (pageSum === pixabayAPI.page) {
                observer.unobserve(anchor);
            }
        } catch (error) {
            console.log(error);
        }
    }
    renderPage();
    
    function loadMoreData() {
        pixabayAPI.page +=1;
        renderPage()
      }
      
      const observer = new IntersectionObserver(
        (entries, observer) => {
          if (entries[0].isIntersecting) {
            loadMoreData();
          }
        },
        {
          root: null,
          rootMargin: "300px",
          threshold: 1,
        }
      );
}


  