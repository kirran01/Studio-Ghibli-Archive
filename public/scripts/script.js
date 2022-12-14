console.log("to wonder is to be adventurous within your mind");

let ratingElements = document.querySelectorAll(".rating-p");
let formElements = document.querySelectorAll(".rating-form");


let revealRater = (e) => {
  console.log(e.target.parentElement.querySelector(".rating-form"));
  //we need parent element querysleector because the p element and form are sibling nodes,
  //so we go a level up to find the parent which is the div "card" and then query select downward.
  e.target.parentElement
    .querySelector(".rating-form")
    .classList.toggle("hidden");
};

for (let i = 0; i < ratingElements.length; i++) {
  ratingElements[i].addEventListener("click", revealRater);
}
