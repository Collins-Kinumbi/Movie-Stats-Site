function createAutoComplete({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) {
  // console.log(root);
  root.innerHTML = `
    <lable><b>Search</b></lable>
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

  async function onInput(e) {
    const items = await fetchData(e.target.value);

    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    resultsWrapper.innerHTML = "";

    dropdown.classList.add("is-active");

    items.forEach((item) => {
      const { imdbID: id } = item;

      const option = document.createElement("a");

      option.classList.add("dropdown-item");

      option.innerHTML = renderOption(item);

      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(id);
      });

      resultsWrapper.appendChild(option);
    });
  }

  input.addEventListener("input", debounce(onInput, 1000));

  document.addEventListener("click", (e) => {
    !root.contains(e.target) && dropdown.classList.remove("is-active");
  });
}
