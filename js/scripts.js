/* 
FSJS techdegree project 5 
Employee Directory 
by Michael Cook
*/

// Globals
let employeesData;
const gallery = document.getElementById("gallery");

// ---------------------------------------------- BASIC FUNCTIONALITY ---------------------------------------------- //

/**
 * Dynamically create an employee card to be displayed
 * @param {Object} employee - employee data object
 * @return {HTML element} cardDiv - html div containing employee details and image
 */
const createEmployeeCard = (employee) => {
  const cardDiv = document.createElement("div");
  cardDiv.className = "card";
  cardInnerHTML = `
        <div class="card-img-container">
            <img class="card-img" src="${employee.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
            <p class="card-text">${employee.email}</p>
            <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
        </div>`;
  cardDiv.innerHTML = cardInnerHTML;
  return cardDiv;
};

/**
 * Create an array of employee objects and assign to the employeesData variable
 * The employeesData array is used to maintain global data for generating modals dynamically
 * @param {Array} results - destructured from employee data
 */
const assignEmployeesData = ({ results }) => {
  const output = new Array();
  results.forEach((result) => {
    const empObj = new Object();
    empObj.img = result.picture.large;
    empObj.name = `${result.name.first} ${result.name.last}`;
    empObj.email = result.email;
    empObj.city = result.location.city;
    empObj.phone = result.phone;
    empObj.address = `${result.location.street.number} ${result.location.street.name}, ${result.location.state} ${result.location.postcode}`;
    empObj.birthday = `Birthday: ${result.dob.date
      .slice(0, 10)
      .replace(/-/g, "/")}`;
    output.push(empObj);
  });
  employeesData = output;
};

/**
 * Add a click event listener to each card that calls createModal onclick
 * This function is written to allow the user to click anywhere in the card
 * Depending on where the user clicks, the function uses DOM traversal to get the outermost card div and pass it to createModal
 */
const addCardEventListeners = () => {
  const cards = Array.from(document.querySelectorAll(".card"));
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      let card;
      if (e.target.className === "card") {
        card = e.target;
      } else if (
        e.target.className === "card-img-container" ||
        e.target.className === "card-info-container"
      ) {
        card = e.target.parentNode;
      } else if (
        e.target.parentNode.className === "card-info-container" ||
        e.target.className === "card-img"
      ) {
        card = e.target.parentNode.parentNode;
      } else {
        return;
      }
      createModal(card);
    });
  });
};

/**
 * For each employee object, create and append a card div to the page
 * Function destructures the results array out of the data object
 * Calls assignEmployeesData and addCardEventListeners
 * Rationale for calling these functions here is they don't return promises,
 * so calling them inside displayEmployeeCards instead of in a "then" method makes more sense
 * @param {Array} data - array of employee data objects
 */
const displayEmployeeCards = ({ results }) => {
  results.forEach((employee) => {
    const employeeCard = createEmployeeCard(employee);
    gallery.appendChild(employeeCard);
  });
  assignEmployeesData({ results });
  addCardEventListeners();
};

/**
 * Handle error and display a message to the page
 * @param {Object} err - error object
 */
const handleError = (err) => {
  const header = document.querySelector(".header-text-container");
  const h4 = document.createElement("h4");
  h4.textContent = `Oops! Something went wrong: ${err.message}`;
  header.appendChild(h4);
};

// Asynchronously fetch data from the API
fetch("https://randomuser.me/api/?results=12&nat=ca,au,nz,us")
  .then((res) => res.json())
  .then((data) => displayEmployeeCards(data))
  .catch((err) => handleError(err));

// ---------------------------------------------- MODAL ---------------------------------------------- //

/**
 * Generate a modal element for an employee card
 * This function works by getting the index of the clicked card in the collection of card elements, and using that
 * index to get the data for the employee from the employeesData array, which it uses to populate the modal
 * I believe this is a cleaner solution than getting the employee data from the textContent properties of the card
 * @param {Number} el - employee card element clicked by user
 */
function createModal(el) {
  removeModal();
  const cards = Array.from(document.querySelectorAll(".card"));
  const index = cards.indexOf(el);
  const employee = employeesData[index];
  const modal = document.createElement("div");
  modal.setAttribute("data-employee-index", index);
  modal.className = "modal-container";
  const modalInnerHTML = `
        <div class="modal">
            <button onclick="removeModal();" type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${employee.img}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${employee.name}</h3>
                <p class="modal-text">${employee.email}</p>
                <p class="modal-text cap">${employee.city}</p>
                <hr>
                <p class="modal-text">${employee.phone}</p>
                <p class="modal-text">${employee.address}</p>
                <p class="modal-text">${employee.birthday}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button onclick="navigateEmployees(false);" type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button onclick="navigateEmployees(true);" type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>`;
  modal.innerHTML = modalInnerHTML;
  document.querySelector("body").appendChild(modal);
}

/**
 * Remove modal
 * Called directly in an onclick property on modal close button
 */
const removeModal = () => {
  const modal = document.querySelector(".modal-container");
  if (modal) modal.remove();
};

/**
 * Scroll to next or previous employee from modal
 * @param {Bool} next - true to next, false to navigate to previous
 */
function navigateEmployees(next) {
  const modal = document.querySelector(".modal");
  if (modal) {
    let index = document
      .querySelector(".modal-container")
      .getAttribute("data-employee-index");
    if (next && index < 11) {
      index++;
    } else if (!next && index > 0) {
      index--;
    }
    const employee = Array.from(gallery.children)[index];
    createModal(employee);
  }
}

/**
 * Allow modal to be closed by pressing the ESC key
 * Allow user to navigate employees using arrow keys
 */
document.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    removeModal();
  } else if (e.keyCode === 37) {
    navigateEmployees(false);
  } else if (e.keyCode === 39) {
    navigateEmployees(true);
  }
});

// ---------------------------------------------- SEARCH ---------------------------------------------- //

/**
 * Add the search form dynamically so that if JS isn't enabled, the user will not see a search bar that lacks functionality
 */
document.querySelector(".search-container").innerHTML = `
<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`;

/**
 * Append a no results message to the page header
 */
const noResultsMessage = () => {
  const header = document.querySelector(".header-text-container");
  const h3 = document.createElement("h3");
  h3.setAttribute("id", "no-results-message");
  h3.textContent = "No results";
  header.appendChild(h3);
};

/**
 * Remove no results message from the DOM
 */
const removeNoResultsMessage = () => {
  const msg = document.getElementById("no-results-message");
  if (msg) msg.remove();
};

/**
 * Determine if there are no results of a search, and if no results call noResultsMessage function
 * @param {Array} employeeCards - array of employee cards passed from the filter function
 */
const checkForNoResults = (employeeCards) => {
  for (let card of employeeCards) {
    if (window.getComputedStyle(card).display === "flex") {
      return;
    }
  }
  noResultsMessage();
};

/**
 * Filter employees by setting non-matches to display:none
 * Call removeNoResultsMessage so that if there are results of a search the message does not remain
 * @param {String} searchKeys - keys inputted by user to search for an employee
 */
const filter = (searchKeys) => {
  removeNoResultsMessage();
  const employeeCards = Array.from(document.querySelectorAll(".card"));
  for (let i = 0; i < employeesData.length; i++) {
    if (!employeesData[i].name.toLowerCase().includes(searchKeys)) {
      employeeCards[i].style.display = "none";
    } else {
      employeeCards[i].style.display = "flex";
    }
  }
  checkForNoResults(employeeCards);
};

const searchBtn = document.getElementById("search-submit");
const searchInput = document.getElementById("search-input");

/**
 * Listen for clicks on the search button, call the filter function and pass the searchInput value
 */
searchBtn.addEventListener("click", (e) => {
  // prevent form submission since the form does not need to actually send a server request
  e.preventDefault();
  // unfocus the search button after clicking
  searchBtn.blur();
  const searchKeys = searchInput.value;
  filter(searchKeys);
});

/**
 * Listen for the 'input' event, filter based on search keys entered
 * The 'input' event is used instead of keyup or keydown because this event fires
 * whenever the value of the input is changed, allowing the filter function to be called
 * when the user clicks the X supplied by the user agent
 */
searchInput.addEventListener("input", (e) => {
  const searchKeys = searchInput.value;
  filter(searchKeys);
});
