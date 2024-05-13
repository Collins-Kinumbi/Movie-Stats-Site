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

    const { data } = response;
    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
};

const input = document.querySelector("input");

const onInput = (e) => {
  fetchData(e.target.value);
};

input.addEventListener("input", debounce(onInput, 1000));
