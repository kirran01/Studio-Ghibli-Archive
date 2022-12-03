console.log("lean into your kindest self");
let filterButtonElement = document.querySelector(".filter-toggle");
console.log(filterButtonElement);

let filterElement = document.querySelector(".sorting");
console.log(filterElement);

let revealFilters = (e) => {
  filterElement.classList.toggle("sorting-dissapear");
};

filterButtonElement.addEventListener("click", revealFilters);
