const allDrinkEl = document.querySelector(".drinksContainer");

const ingrediantsTableEl = document.querySelector("tbody");

const spanEl = document.getElementsByClassName("close")[0];

// modal object so that I can store all the elements in one place
const modalObj = {
  name: document.querySelector("#drink-title"),
  type: document.querySelector("#drink-type"),
  description: document.querySelector("#instructions"),
  glass: document.querySelector("#glass-type"),
  image: document.querySelector("#img-api"),
};

// This is a  copy of the API function in index.js just because its easier
async function getApiId(string) {
  const url = `https://the-cocktail-db.p.rapidapi.com/lookup.php?i=${string}`;
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
    return result.drinks[0];
  } catch (error) {
    console.error(error);
  }
}

//closing the modal when open
spanEl.onclick = function () {
  console.log("clicked");
  modal.style.display = "none";
};

//add a click event to the containe of the randomiser
allDrinkEl.addEventListener("click", async function (e) {
  e.preventDefault();
  // grabs the id of the element that is stored in the html when ever the drinks are loaded in
  const id = e.target.closest("[data-id]").getAttribute("data-id");
  //grab the modal so that I can make it appear
  const modal = document.getElementById("my-modal");
  //turns the modal so that it is seeable
  modal.style.display = "block";
  //allows for you to click off the window so you can close it
  window.onclick = function (e) {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  };

  // get the data from the api of the drink that you have clicked and stores it in obj
  const obj = await getApiId(id);

  // This is the frankenstain of code the create an array of objects for the ingredients and measurements. I'll talk about what is going on here in the pdf
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
  // calls the function so that the ingrediants update
  updateIngrediants(ingrediants);

  // changeing all the names for the modal to give all the information we need
  modalObj.name.textContent = await obj.strDrink;
  modalObj.type.textContent = await obj.strAlcoholic;
  modalObj.description.textContent = await obj.strInstructions;
  modalObj.glass.textContent = await obj.strGlass;
  modalObj.image.setAttribute("src", obj.strDrinkThumb);
});

// This function create the ingrediants list dynamically each time because it was easier this way. (sorry dan)
async function updateIngrediants(arr) {
  removeIngredients();
  for (let n = 0; n < arr.length; n++) {
    const tr = document.createElement("tr");
    const tdIngredient = document.createElement("td");
    const tdMeasurement = document.createElement("td");
    tdIngredient.textContent = arr[n].main;
    tdMeasurement.textContent = arr[n].measure;
    tr.appendChild(tdIngredient);
    tr.appendChild(tdMeasurement);
    ingrediantsTableEl.appendChild(tr);
  }
}

//This function gets rid of all the new ingrediants so that they do not repeat
function removeIngredients() {
  const trEls = document.querySelectorAll("tr");
  const number = trEls.length;
  for (let o = 0; o < number; o++) {
    if (o === 0) {
      continue;
    } else {
      trEls[o].remove();
    }
  }
}
