function createAutoComplete({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
}) {
  // console.log(root);
  root.innerHTML = `
    <lable><b>Search for a movie</b></lable>
    <input class='input'/>
    <div class='dropdown'>
       <div class='dropdown-menu'>
         <div class="dropdown-content results">
       </div>
    </div>
  `;

  const input = root.querySelector("input");

  const dropdown = root.querySelector(".dropdown");

  const resultsWrapper = root.querySelector(".results");

  const onInput = async (e) => {
    const movies = await fetchData(e.target.value);

    if (!movies.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    resultsWrapper.innerHTML = "";

    dropdown.classList.add("is-active");

    movies.forEach((movie) => {
      const { imdbID: id } = movie;

      const option = document.createElement("a");

      option.classList.add("dropdown-item");

      option.innerHTML = renderOption(movie);

      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(movie);
        onOptionSelect(id);
      });

      resultsWrapper.appendChild(option);
    });
  };

  input.addEventListener("input", debounce(onInput, 1000));

  document.addEventListener("click", (e) => {
    !root.contains(e.target) && dropdown.classList.remove("is-active");
  });
}
