/* 
FSJS techdegree project 5 
Employee Directory 
by Michael Cook
*/

// API docs: https://randomuser.me/documentation


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
        </div>`;
    cardDiv.innerHTML = cardInnerHTML;
    return cardDiv;
}


/**
 * For each employee object, create and append a card div to the page
 * Function destructures the results array out of the data object
 * @param {Array} data - array of employee data objects 
 */
const displayEmployeeCards = ({ results }) => {
    const gallery = document.getElementById('gallery');
    results.forEach(employee => {
        const employeeCard = createEmployeeCard(employee);
        gallery.appendChild(employeeCard);
    });
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