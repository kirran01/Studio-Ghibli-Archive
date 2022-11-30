console.log("today is good");

let ratingElements = document.querySelectorAll(".rating-p");
let formElements = document.querySelectorAll(".rating-form");

let revealRater = (e) => {
  // for (let i = 0; i < formElements.length; i++) {
  //   formElements[i]
  // }
  e.currentTarget.parentElement.querySelector('.rating-form').classList.toggle("hidden");
};

for (let i = 0; i < ratingElements.length; i++) {
  ratingElements[i].addEventListener("click", revealRater);
}
