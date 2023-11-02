const rightArrow = document.querySelector(".right");
const leftArrow = document.querySelector(".left");
const container = document.querySelector(".picks-inner");
const cardArray = document.querySelectorAll(".card");
const changeBtn = document.querySelector(".change");
const allDrinks = document.querySelectorAll(".drink-card");
const drinksContainer = document.querySelector(".drinksContainer");

// THis is a function that change the carousel width when changing size of the screen to allow for the size of each card with in to be easier to handle when in Desktop mode
function changeCarouselWidth() {
  if (this.window.innerWidth >= 550) {
    container.style.width = `${550 * cardArray.length}px`;
  } else if (this.window.innerWidth < 550) {
    container.style.width = `${cardArray.length}00vw`;
  }
}
// This make sure that the user can not got left when the website is loaded
leftArrow.style.display = "none";

// calls the function to allow for it to get the right size depending on size of the screen
changeCarouselWidth();

// this is for when the api call 10 different drinks we can use this to grab a random drink from the selection
function randonNumber(number) {
  return Math.floor(Math.random() * number);
}
// This is a function to get the API, it takes two params, the first being for the bigger part of the string and then the second part is the part that can be different such as an id or the random selection
async function getAPI() {
  const url = "https://the-cocktail-db.p.rapidapi.com/randomselection.php";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "4ef4ff2aa1mshc058d32cee8d29dp1a5b52jsnfd5943f08fc1",
      "X-RapidAPI-Host": "the-cocktail-db.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.drinks[randonNumber(10)];
  } catch (error) {
    console.error(error);
  }
}

// thsi function updates the randomiser by get the API and also make sure that we get no dupelicates.
async function updateRandomiser() {
  let addedDrinks = [];
  let count = 0;
  let number = 4;
  for (let n = 0; n < number; n++) {
    const obj = await getAPI();
    if (addedDrinks.length === 0) {
      changeCard(obj, count);
      addedDrinks.push(obj.strDrink);
      count++;
    } else {
      if (addedDrinks.includes(obj.strDrink)) {
        number++;
        continue;
      } else if (!addedDrinks.includes(obj.strDrink)) {
        changeCard(obj, count);
        addedDrinks.push(obj.strDrink);
        count++;
      } else {
        break;
      }
    }
  }
}

// This is the function to allow each of the cards to change when the button is clicked.
function changeCard(obj, n) {
  const card = drinksContainer.querySelector(`[data-number="${n + 1}"]`);
  const drinkTitle = card.querySelector(".drink-title");

  const drinkImg = card.querySelector(".drink-img");

  card.setAttribute("data-id", obj.idDrink);

  drinkTitle.textContent = obj.strDrink;
  drinkImg.setAttribute("src", obj.strDrinkThumb);
  drinkImg.setAttribute("alt", `image of ${obj.strDrink}`);
}

// updates the randomiser so the website has values straight away.
updateRandomiser("./APIcall.json");

//click event for the button to refresh the randomiser
changeBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  updateRandomiser("./APIcall.json");
});

// This function get the API and because of the way the API is formatted each individual ingrediant and measurement is in their own key so I came up with this to get the ingrediants out for the modal.
async function getIngrediants() {
  const obj = await getAPI();
  let count = 1;
  let number = 1;
  const ingrediants = [];
  for (const key in obj) {
    // if (obj.hasOwnProperty(key)) {
    //   console.log(`${key}: ${obj[key]}`);
    // }
    if (obj[key] === null || obj[key] === "") {
      continue;
    } else if (key === `strIngredient${count}`) {
      ingrediants.push({ main: obj[key] });
      count++;
    } else if (key === `strMeasure${number}`) {
      ingrediants[number - 1].measure = obj[key];
      number++;
    } else {
      continue;
    }
  }
}

//gets the divided amountmso each card can fit
const dividedNumber = 100 / Number(cardArray.length);
//create currentcard and final number varibles outside scope
let currentCard = "";
let finalNumber = "";
//creating function for clicking arrows on the carousel
const clickArrow = (str) => {
  let cardNumber = "";
  // making sure arrows are availble to press at start of click
  rightArrow.style.display = "block";
  leftArrow.style.display = "block";
  //this if statment cicles through all of the cards availble
  for (let i = 0; i < cardArray.length; i++) {
    //each time we go through we get a card from card array to grab the card variable.
    const card = cardArray[i];
    //we then grab the attribute from the current card to see if its current on it.
    const boolion = card.getAttribute("data-viewing");
    if (boolion == "true") {
      // if true, we change the attribute to false as it will no longer be true and on the card.
      card.setAttribute("data-viewing", "false");
      //depending on which arrow is clicked will either select the previous one in the array or next to allow for the attribute to be turned to true.
      if (str === "left") {
        cardArray[i - 1].setAttribute("data-viewing", "true");
      } else if (str === "right") {
        cardArray[i + 1].setAttribute("data-viewing", "true");
      }
      //make sure current card has true setting in the attribute
      currentCard = cardArray[i];
      break;
    }
  }
  if (str === "left") {
    //grabs card number from data number attribute
    cardNumber = Number(currentCard.getAttribute("data-number")) - 1;
    finalNumber -= dividedNumber;
  } else if (str === "right") {
    cardNumber = Number(currentCard.getAttribute("data-number")) + 1;
    finalNumber = dividedNumber * cardNumber;
  }
  container.style.transform = `translateX(-${finalNumber}%)`;
  if (cardNumber === 0) {
    leftArrow.style.display = "none";
  } else if (cardNumber + 1 === cardArray.length) {
    rightArrow.style.display = "none";
  }
};

//click event for the left arrow
leftArrow.addEventListener("click", (e) => {
  e.preventDefault();
  clickArrow("left");
});

//click event for the right arrow
rightArrow.addEventListener("click", (e) => {
  e.preventDefault();
  clickArrow("right");
});

window.addEventListener("resize", function (e) {
  e.preventDefault();
  changeCarouselWidth();
});
