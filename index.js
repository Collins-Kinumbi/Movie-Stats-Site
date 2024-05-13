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

const input = document.querySelector("input");

const onInput = async (e) => {
  const movies = await fetchData(e.target.value);

  movies.forEach((movie) => {
    const { Poster: poster, Title: title } = movie;

    const div = document.createElement("div");
    div.innerHTML = `
    <img src='${poster}'/>
    <h1>${title}<h1/>
    `;
    document.querySelector(".target").appendChild(div);
  });
};

input.addEventListener("input", debounce(onInput, 1000));
