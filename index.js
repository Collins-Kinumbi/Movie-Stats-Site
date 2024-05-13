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

function debounce(callback, delay = 1000) {
  let timeOutID;
  return (...args) => {
    // Input debouncing
    timeOutID && clearTimeout(timeOutID);

    timeOutID = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };
}

const onInput = debounce((e) => {
  fetchData(e.target.value);
}, 1000);

input.addEventListener("input", onInput);
