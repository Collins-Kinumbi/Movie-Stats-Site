"use strict";

const key = "712040f4";

const fetchData = async function (searchTerm) {
  try {
    const response = await axios.get(`http://www.omdbapi.com/`, {
      params: {
        apikey: key,
        s: searchTerm,
      },
    });

    if (response.data.Error) {
      return [];
    }

    const { Search: search } = response.data;

    return search;
  } catch (error) {
    console.error(error.message);
  }
};

const root = document.querySelector(".autocomplete");

root.innerHTML = `
  <lable><b>Search for a movie</b></lable>
  <input class='input'/>
  <div class='dropdown'>
     <div class='dropdown-menu'>
       <div class="dropdown-content results">
     </div>
  </div>


`;

const input = document.querySelector("input");

const dropdown = document.querySelector(".dropdown");

const resultsWrapper = document.querySelector(".results");

const onInput = async (e) => {
  const movies = await fetchData(e.target.value);

  if (!movies.length) {
    dropdown.classList.remove("is-active");
    return;
  }

  resultsWrapper.innerHTML = "";

  dropdown.classList.add("is-active");

  movies.forEach((movie) => {
    const { Poster: poster, Title: title, imdbID: id } = movie;

    const option = document.createElement("a");

    const imgSrc = poster === "N/A" ? "" : poster;

    option.classList.add("dropdown-item");

    option.innerHTML = `
    <img src='${imgSrc}'/>
        ${title}
    `;

    option.addEventListener("click", () => {
      dropdown.classList.remove("is-active");
      input.value = title;
      onMovieSelect(id);
    });

    resultsWrapper.appendChild(option);
  });
};

input.addEventListener("input", debounce(onInput, 1000));

document.addEventListener("click", (e) => {
  !root.contains(e.target) && dropdown.classList.remove("is-active");
});

async function onMovieSelect(id) {
  const response = await axios.get(`http://www.omdbapi.com/`, {
    params: {
      apikey: key,
      i: id,
    },
  });

  // console.log(response.data);
  const { data } = response;
  console.log(data);
  document.querySelector("#summary").innerHTML = movieTemplate(data);
}

function movieTemplate(movieDetail) {
  const {
    Poster: poster,
    Title: title,
    Genre: genre,
    Type: type,
    Plot: plot,
    Awards: awards,
    BoxOffice: boxOffice,
    Metascore: metascore,
    imdbRating,
    imdbVotes,
  } = movieDetail;

  return `
   <article class='media'>
     <figure class="media-left">
       <p class='image'>
       <img src='${poster}'/>
       </p>
     </figure>
     <div class='media-content'>
       <div class='content'>
         <h1>${title}</h1>
         <h4>${genre}</h4>
         <h4>${type}</h4>
         <p>${plot}</p>
       </div>
     </div>
   </article>
   <article class='notification is-primary'>
     <p class='title'>${awards ? awards : "N/A"}</p>
     <p class='subtitle'>Awards</p>
   </article>
   <article class='notification is-primary'>
     <p class='title'>${boxOffice ? boxOffice : "N/A"}</p>
     <p class='subtitle'>Box Office</p>
   </article>
   <article class='notification is-primary'>
     <p class='title'>${metascore ? metascore : "N/A"}</p>
     <p class='subtitle'>Metascore</p>
   </article>
   <article class='notification is-primary'>
     <p class='title'>${imdbRating ? imdbRating : "N/A"}</p>
     <p class='subtitle'>IMDB Rating</p>
   </article>
   <article class='notification is-primary'>
     <p class='title'>${imdbVotes ? imdbVotes : "N/A"}</p>
     <p class='subtitle'>IMDB votes</p>
   </article>
  
  `;
}
