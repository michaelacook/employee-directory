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
 */
const addCardEventListeners = () => {
    const cards = Array.from(document.querySelectorAll('.card'));
    cards.forEach(card => {
        card.addEventListener('click', e => {
            createModal(e);
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
 * @param {Number} e - event object from click
 */
function createModal(e) {
    const cards = Array.from(document.querySelectorAll('.card'));
    const index = cards.indexOf(e.target);
    const employee = employeesArr[index];
    const modal = document.createElement('div');
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
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
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
    modal.remove();
}