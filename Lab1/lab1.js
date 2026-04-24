let form = document.getElementById("event-form"); // targeting the form

let title = document.getElementById("title"); // targeting the title
let date = document.getElementById("date"); // targeting the date
let category = document.getElementById("category"); // targeting the category
let description = document.getElementById("Description"); // targeting the description


let gridCard = document.getElementById("grid-card"); // targeting the card grid


let cardDetails = [];   // array to store card object details


// function to populate the cards
const populate = () => {

    gridCard.innerHTML = '';
    
    
    cardDetails.forEach((card,index) => {
        gridCard.innerHTML += `<div class="card">
        <button class="cancel-btn" id="${index}">&#x274C;</button>
        <h4>${card.title}</h4>
        <p class="date">&#128197; ${card.date}</p>
        <br>
        <label>${card.category}</label>
        <p class="des">${card.description}</p>
        </div>`;
    })

}

//event listener to add event and update the card list (population)
form.addEventListener('submit', (e)=>{
    e.preventDefault();

    cardDetails.push({
        "title":title.value,
        "date":date.value,
        "category":category.value,
        "description":description.value,
    });

    populate();
    
    title.value = '';
    date.value = '';
    description.value = '';
})

//event listener to delete the cards
gridCard.addEventListener( 'click', (e)=>{
    if (e.target.classList.contains("cancel-btn")) {
        const index = e.target.dataset.index;
        cardDetails.splice(index, 1);
        populate();
    }
})