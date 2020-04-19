/* 
FSJS techdegree project 5 
Employee Directory 
by Michael Cook
*/

// API docs: https://randomuser.me/documentation

// Globals 
let employeesArr;
const gallery = document.getElementById('gallery');


/**
 * Dynamically create an employee card to be displayed
 * @param {Object} employee - employee data object
 * @return {HTML element} cardDiv - html div containing employee details and image
 */
const createEmployeeCard = employee => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardInnerHTML = `
        <div class="card-img-container">
            <img class="card-img" src="${employee.picture.thumbnail}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
            <p class="card-text">${employee.email}</p>
            <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            <div class="hidden" data-show="hiddenValues">
                <p>${employee.phone}</p>
                <p>${employee.location.street.number} ${employee.location.street.name}, ${employee.location.state} ${employee.location.postcode}</p>
                <p>Birthday: ${employee.dob.date.slice(0, 10)}</p>
            </div>
        </div>`;
    cardDiv.innerHTML = cardInnerHTML;
    return cardDiv;
}


/**
 * Create an array of employee objects and assign to the employeesArr variable 
 * The employeesArr array is used to maintain global data for generating modals dynamically
 * @param {Array} results - destructured from employee data 
 */
const assignEmployeesArr = ({ results }) => {
    const output = new Array();
    results.forEach(result => {
        const empObj = new Object();
        empObj.img = result.picture.thumbnail;
        empObj.name = `${result.name.first} ${result.name.last}`;
        empObj.email = result.email;
        empObj.city = result.location.city;
        empObj.phone = result.phone;
        empObj.address = `${result.location.street.number} ${result.location.street.name}, ${result.location.state} ${result.location.postcode}`;
        empObj.birthday = `Birthday: ${result.dob.date.slice(0, 10).replace(/-/g, '/')}`;
        output.push(empObj);
    });
    employeesArr = output;
}


/**
 * Add a click event listener to each card that calls createModal onclick
 * This function is written to allow the user to click anywhere in the card 
 * Depending on where the user clicks, the function uses DOM traversal to get the outermost card div and pass it to createModal
 * I don't know if this function is written in the most efficient way, but I couldn't figure out another way to do it
 */
const addCardEventListeners = () => {
    const cards = Array.from(document.querySelectorAll('.card'));
    cards.forEach(card => {
        card.addEventListener('click', e => {
            let card;
            if (e.target.className === 'card') {
                card = e.target;
            } else if (e.target.className === 'card-img-container' ||
                       e.target.className === 'card-info-container') {
                card = e.target.parentNode;
            } else if (e.target.className === 'card-img') {
                card = e.target.parentNode.parentNode;
            } else if (e.target.parentNode.className === "card-info-container") {
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
 * Calls assignEmployeesArr 
 * @param {Array} data - array of employee data objects 
 */
const displayEmployeeCards = ({ results }) => {
    const gallery = document.getElementById('gallery');
    results.forEach(employee => {
        const employeeCard = createEmployeeCard(employee);
        gallery.appendChild(employeeCard);
    });
    assignEmployeesArr({ results });
    addCardEventListeners();
}


/**
 * Handle error and display a message to the page
 * @param {Object} err - error object 
 */
const handleError = err => {
    const header = document.querySelector('.header-text-container');
    const h4 = document.createElement('h4');
    h4.textContent = `Oops! Something went wrong: ${err.message}`;
    header.appendChild(h4);
}


// Asynchronously fetch data from the API
fetch('https://randomuser.me/api/?results=12')
    .then(res => res.json())
    .then(data => displayEmployeeCards(data))
    .catch(err => handleError(err));


// ---------------------------------------------- MODAL ---------------------------------------------- //


/**
 * Generate a modal element for an employee
 * Function destructures the target object from the event object
 * @param {Number} el - event object from click
 */
function createModal(el) {
    removeModal();
    const cards = Array.from(document.querySelectorAll('.card'));
    const index = cards.indexOf(el);
    const employee = employeesArr[index];
    const modal = document.createElement('div');
    modal.setAttribute('data-employee-index', index);
    modal.className = 'modal-container';
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
    document.querySelector('body').appendChild(modal);
}


/**
 * Remove modal 
 * Called directly in an onclick property on modal close button
 */
const removeModal = () => {
    const modal = document.querySelector('.modal-container');
    if (modal) modal.remove();
}


/**
 * Scroll to next or previous employee from modal
 * @param {Number} currentIndex - index of current employee in the employeesArr array
 * @param {Bool} next - true to next, false to navigate to previous
 */
function navigateEmployees(next) {
    let index = document.querySelector('.modal-container').getAttribute('data-employee-index');
    if (next && index < 11) {
        index++;
    } else if (!next && index > 0) {
        index--;
    }
    const employee = Array.from(gallery.children)[index];
    createModal(employee);
}