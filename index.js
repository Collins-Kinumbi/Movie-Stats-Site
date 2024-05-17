"use strict";

const key = "712040f4";

createAutoComplete({
  root: document.querySelector(".autocomplete"),
  renderOption(movie) {
    const { Poster: poster, Title: title, Year: year } = movie;

    const imgSrc = poster === "N/A" ? "" : poster;

    return `
    <img src='${imgSrc}'/>
        ${title} (${year})
    `;
  },

  onOptionSelect(movie) {
    onMovieSelect(movie);
  },

  inputValue(movie) {
    const { Title: title } = movie;
    return title;
  },

  async fetchData(searchTerm) {
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
  },
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
  // console.log(data);
  document.querySelector("#summary").innerHTML = movieTemplate(data);
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

  return `
   <article class='media'>
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
