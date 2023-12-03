
const Apikey = `ec920dfb6377429c67744e902c758536`
const api = `https://api.themoviedb.org/3/movie/top_rated?api_key=${Apikey}&language=en-US`
const movieListingTag = document.querySelector('.moviesListing');
const IMAGE_URL = "https://image.tmdb.org/t/p/original";
let currentpage = 1;
const prevBtnTag = document.querySelector('.prevbtn');
const nextBtnTag = document.querySelector('.nextbtn');
const sortByDatebtnTag = document.querySelector('.sortByDate');
const sortByratingBtnTag = document.querySelector('.sortByRating');
const searchBtnTag = document.querySelector('.searchBtn')
let currentMovieData = '';
let sortedByDateMovieData = '';
let sortedByRatingMovieData = '';
let isSortedByDate = false;
let isSortedByRatings = false;


// Assigning events to the buttons


searchBtnTag.addEventListener('click', (e) => {
    e.preventDefault();
})

prevBtnTag.addEventListener('click', () => {
    if(currentpage === 1){
        return;
    }
    currentpage--;
    getPaginatedMovieData(currentpage);

})
nextBtnTag.addEventListener('click', () => {
    if(currentpage === 3){
        return;
    }
    currentpage++; 
    getPaginatedMovieData(currentpage);

})



// sorting buttons events



sortByDatebtnTag.addEventListener('click', () => {
    if(isSortedByDate){
        isSortedByDate = false;
        isSortedByRatings = false;
        updateMoviePage(currentMovieData)
        return;
    }

    isSortedByDate = true;
    isSortedByRatings = false;
    if(!sortedByDateMovieData){
        sortedByDateMovieData =  sortMovie([...currentMovieData] ,'date');
    }
    updateMoviePage(sortedByDateMovieData);

})


sortByratingBtnTag.addEventListener('click', () => {
    if(isSortedByRatings){
        isSortedByRatings = false;
        isSortedByDate = false;
        updateMoviePage(currentMovieData)
        return;
    }  

    isSortedByRatings = true;
    isSortedByDate = false;
    if(!sortedByRatingMovieData){
        sortedByRatingMovieData = sortMovie([...currentMovieData] ,'rating');
    }
    updateMoviePage(sortedByRatingMovieData);

})

// function handleFilter(clicked, supplement, clickedDetaSet){
//     if(isSortedByRatings){
//         isSortedByRatings = false;
//         isSortedByDate = false;
//         updateMoviePage(currentMovieData)
//         return;
//     }  

//     isSortedByRatings = true;
//     isSortedByDate = false;
//     if(!sortedByRatingMovieData){
//         sortedByRatingMovieData = sortMovie([...currentMovieData] ,'rating');
//     }
//     updateMoviePage(sortedByRatingMovieData);

// }
 


function updateMoviePage(movieArray){
    // const updateMovieListing = document.createDocumentFragment();
    let updateMovieListing = '';
    for(let {title, vote_count,vote_average,poster_path, isFavourite, id} of movieArray){
        const movieUrl = `${IMAGE_URL}/${poster_path}`
        const movieCard = `<div class="movie-card">
        <img src = "${movieUrl}" alt="">

             <div class="movie-details">
                <h5>${title}</h5>
                <div>
                    <span>Votes: ${vote_count}</span>
                    <span>Ratings: ${vote_average}</span>
                </div>
                <i 
                class="fa-heart ${isFavourite ? 'fa-solid' : 'fa-regular'}"
                style="color: #ff2e2e;" 
                id = "${id}"
                data-isfavourite = "${isFavourite}"
                >
                </i>

        </div>
    </div>`
    updateMovieListing += movieCard;
    }
    movieListingTag.innerHTML = updateMovieListing;
    //   movieListingTag.innerHTML = '';

  const favIframeTags =  document.querySelectorAll('.fa-heart');
  for(let favIcon of favIframeTags){
    favIcon.addEventListener('click', handleFavourite)
  }
}

function handleFavourite(e){
    let isRemove = false;
    if(e.target.dataset.isFavourite  == 'true'){
        e.target.classList.remove('fa-solid')
        e.target.classList.add('fa-regular')
        e.target.dataset.isFavourite = false; 
        isRemove = true;       
    }
    else{
        e.target.classList.remove('fa-regular')
        e.target.classList.add('fa-solid')
        e.target.dataset.isFavourite = true;
    }

   const filteredArr = currentMovieData.filter((val, index) => {
    return val.id == e.target.id;
    })

   const localMovieStorage = JSON.parse(localStorage.getItem('favouriteMoiveList'));


   if(!isRemove){
    let newFavObj;

   if(localMovieStorage){
    newFavObj = {
        [filteredArr[0].id] : filteredArr[0],
        ...localMovieStorage
      } 
   }
   
   else{
       newFavObj = {
           [filteredArr[0].id] : filteredArr[0]
        } 
    }
     localStorage.setItem('favouriteMoiveList', JSON.stringify(newFavObj));
   }
     else{
        if(localMovieStorage){
            delete localMovieStorage[filteredArr[0].id]
        }
        localStorage.setItem('favouriteMoiveList', JSON.stringify(localMovieStorage))
   }
    
   

    
}
async function getPaginatedMovieData(page = 1){
    resetPageValues()
    movieListingTag.innerHTML = 'loading';
    const response =  await fetch(`${api}&page=${page}`);
    const movieData = await response.json();
    currentMovieData = movieData.results;
    updateMoviePage(movieData.results);
}

function resetPageValues(){
    sortedByDateMovieData = "";
    sortedByRatingMovieData = "";
    let isSortedByDate = false;
    let isSortedByRatings = false;
}



function sortMovie(movieArray, sortBy){
    let sortingKey = '';
    if(sortBy === 'date'){
        sortingKey = 'release_date';
        movieArray.sort((movieObjA, movieObjB) => {
            movieObjA.epochTime = new Date(movieObjA[sortingKey]);
            movieObjB.epochTime = new Date(movieObjB[sortingKey]);
            return movieObjA.epochTime - movieObjB.epochTime
        })
    }

    else if(sortBy === 'rating'){
        sortingKey = 'vote_average';
        movieArray.sort((movieObjA, movieObjB) => {
            return movieObjA[sortingKey] - movieObjB[sortingKey];
        })
    }

    return movieArray;
}

        getPaginatedMovieData(currentpage);

       
