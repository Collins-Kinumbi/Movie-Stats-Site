"use strict";

const key = "712040f4";

const autoCompleteConfig = {
  renderOption(movie) {
    const { Poster: poster, Title: title, Year: year } = movie;

    const imgSrc = poster === "N/A" ? "" : poster;

    return `
    <img src='${imgSrc}'/>
        ${title} (${year})
    `;
  },

  inputValue(movie) {
    const { Title: title } = movie;
    return title;
  },

  async fetchData(searchTerm) {
    try {
      const response = await axios.get(`https://www.omdbapi.com/`, {
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
  },
};

// Left autocomplete
createAutoComplete({
  root: document.querySelector("#left-autocomplete"),
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});

// right autocomplete
createAutoComplete({
  root: document.querySelector("#right-autocomplete"),
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});

let rightMovie, leftMovie;

async function onMovieSelect(id, summaryEl, side) {
  const response = await axios.get(`https://www.omdbapi.com/`, {
    params: {
      apikey: key,
      i: id,
    },
  });

  // console.log(response.data);
  const { data } = response;
  // console.log(data);
  summaryEl.innerHTML = movieTemplate(data);

  side === "left" ? (leftMovie = data) : (rightMovie = data);

  leftMovie && rightMovie && runComparison();

  function runComparison() {
    const leftSideStats = document.querySelectorAll(
      "#left-summary .notification"
    );
    const rightSideStats = document.querySelectorAll(
      "#right-summary .notification"
    );

    leftSideStats.forEach((leftStat, index) => {
      const rightStat = rightSideStats[index];

      const leftSideValue = leftStat.dataset.value;

      const rightSideValue = rightStat.dataset.value;

      if (rightSideValue > leftSideValue) {
        leftStat.classList.remove("is-primary");
        leftStat.classList.add("is-warning");
      } else {
        rightStat.classList.remove("is-primary");
        rightStat.classList.add("is-warning");
      }
    });
  }
}

function movieTemplate(movieDetail) {
  const {
    Poster: poster,
    Title: title,
    Year: year,
    Genre: genre,
    Type: type,
    Plot: plot,
    Awards: awards,
    BoxOffice: boxOffice,
    Metascore: metascore,
    imdbRating,
    imdbVotes,
  } = movieDetail;

  const dollars = parseInt(boxOffice?.replace(/\$/g, "").replace(/,/g, ""));
  const metaScore = parseInt(metascore);
  const imdbR = parseFloat(imdbRating);
  const votes = parseFloat(imdbVotes?.replace(/,/g, ""));

  const movieAwards = awards.split(" ").reduce((prev, word) => {
    const value = parseFloat(word);

    if (isNaN(value)) {
      return prev;
    }
    return prev + value;
  }, 0);

  return `
   <article class='media' >
     <figure class="media-left">
       <p class='image'>
       <img src='${poster}'/>
       </p>
     </figure>
     <div class='media-content'>
       <div class='content'>
         <h1>${title} (${year})</h1>
         <h4>${genre}</h4>
         <h4>${type}</h4>
         <p>${plot}</p>
       </div>
     </div>
   </article>
   <article data-value=${movieAwards} class='notification is-primary'>
     <p class='title'>${awards ? awards : "N/A"}</p>
     <p class='subtitle'>Awards</p>
   </article>

   <article data-value=${dollars} class='notification is-primary'>
     <p class='title'>${boxOffice ? boxOffice : "N/A"}</p>
     <p class='subtitle'>Box Office</p>
   </article>

   <article data-value=${metaScore} class='notification is-primary'>
     <p class='title'>${metascore ? metascore : "N/A"}</p>
     <p class='subtitle'>Metascore</p>
   </article>

   <article data-value=${imdbR} class='notification is-primary'>
     <p class='title'>${imdbRating ? imdbRating : "N/A"}</p>
     <p class='subtitle'>IMDB Rating</p>
   </article>

   <article data-value=${votes} class='notification is-primary'>
     <p class='title'>${imdbVotes ? imdbVotes : "N/A"}</p>
     <p class='subtitle'>IMDB votes</p>
   </article>
  
  `;
}
