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
