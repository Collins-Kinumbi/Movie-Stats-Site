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

    const { Search: search } = response.data;

    return search;
  } catch (error) {
    console.error(error.message);
  }
};

const input = document.querySelector("input");

const onInput = async (e) => {
  const movies = await fetchData(e.target.value);

  console.log(movies);
};

input.addEventListener("input", debounce(onInput, 1000));
