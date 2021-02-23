"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let allAnimalFiltered = [];
let allWinnerAnimal = [];


const settings = {
    filter: null,
    sortBy: null,
    sortDir: "asc"
}

// The prototype for all animals: 
const Animal = {
    winner: "" ,
    star:"", 
    name: "",
    desc: "-unknown animal-",
    type: "",
    age: 0
    // TODO: Add winner-info

};

function start( ) {
    console.log("ready");

    document.querySelector("[data-filter=cat]").addEventListener("click", catButton);
    document.querySelector("[data-filter=dog]").addEventListener("click", dogButton);
    document.querySelector("[data-filter=all]").addEventListener("click", allButton);
    document.querySelector("[data-action=sort]").addEventListener("click", sortButton);
    loadJSON();
    // TODO: Add event-listeners to filter and sort buttons
}


async function loadJSON() {
    const response = await fetch("animals.json");
    const jsonData = await response.json();
    
    // when loaded, prepare data objects
    prepareObjects( jsonData );
}

function prepareObjects( jsonData ) {
    allAnimals = jsonData.map( preapareObject );
    allAnimalFiltered = allAnimals;
    buildList();
    //displayList(allAnimals);
}

function catButton() {
    const onlyCats = allAnimals.filter(isCat);
    allAnimalFiltered = onlyCats;
    displayList(onlyCats);
}

function dogButton() {
    const onlyDogs = allAnimals.filter(isDog);
    allAnimalFiltered = onlyDogs;
    displayList(onlyDogs);
}

function allButton() {
    const all = allAnimals;
    allAnimalFiltered = all;
    displayList(all);
    console.log(all);
}

function sortButton() {
    // const sortNames = allAnimals.sort(compareName);
    // allAnimals.sort(compareByName);
    const sortBy = event.target.dataset.sort;

    displayList(allAnimals);
}

function preapareObject( jsonObject ) {
    const animal = Object.create(Animal);
    
    animal.winner = false ;
    animal.star = "☆";
    const texts = jsonObject.fullname.split(" ");
    animal.name = texts[0];
    animal.desc = texts[2];
    animal.type = texts[3];
    animal.age = jsonObject.age;

    return animal;
}

function buildList() {
    
    //const currentList =  allAnimals; // TODO: Add filter and sort on this list, before displaying
    displayList( allAnimalFiltered );
}

function displayList(animals) {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    animals.forEach( displayAnimal );
}

function displayAnimal( animal ) {
    // create clone
    const clone = document.querySelector("template#animal").content.cloneNode(true);

    // set clone data
    // TODO: Display winner
    clone.querySelector("[data-field=winner]").addEventListener("click", clickWinner );

    function clickWinner () {
        console.log("hahahah");
        if (animal.winner == false) {
            let won = checkWinnerNumber(animal) ;
            console.log(won);
            animal.winner = won;
            /*console.log("⭐");*/
        } else { 
            animal.winner = false;
            allWinnerAnimal = allWinnerAnimal.filter(isLoser);
            console.log(allWinnerAnimal);
        }
        console.log(animal);
        buildList();
    }

    if (animal.winner == false ) {
        //🏆
        clone.querySelector("[data-field=winner]").classList.add ("loser") ;
    } else {
        clone.querySelector("[data-field=winner]").classList.remove ("loser") ;
    }

    clone.querySelector("[data-field=star]").addEventListener("click", clickStar);
    
    function clickStar() {
        if (animal.star === "☆") {
            animal.star = "⭐";
            console.log("⭐");
        } else if (animal.star === "⭐") { 
            animal.star = "☆";
            console.log("☆");
        }
        console.log(animal);
        buildList();
    }

    clone.querySelector("[data-field=star]").textContent = animal.star;
    clone.querySelector("[data-field=name]").textContent = animal.name;
    clone.querySelector("[data-field=desc]").textContent = animal.desc;
    clone.querySelector("[data-field=type]").textContent = animal.type;
    clone.querySelector("[data-field=age]").textContent = animal.age;

    // TODO: Add event listeners for star and winner

    // append clone to list
    document.querySelector("#list tbody").appendChild( clone );
}

function checkWinnerNumber (animal) {

    if ( allWinnerAnimal.length < 2 ) {
        //call check type function 
        let noDouble = checkType(animal);
         if (noDouble == true){
            allWinnerAnimal.unshift(animal);
         }
        return noDouble 
    } else  {
        console.log("you can do that");
        displayModalTwo();
        return false
    }
}

function displayModalTwo() {
    console.log(displayModalTwo);
    document.querySelector("#modal").classList.remove("hide");

    if (allWinnerAnimal.length == 2) {
    document.querySelector(".modalHeader").textContent = "You can only have two Winners!";
    document.querySelector(".modalText").textContent = "Remove a winner";
    document.querySelector("#modalWinner1").textContent = "Remove";
    document.querySelector("#modalWinnerText1").textContent = allWinnerAnimal[0].name;
    document.querySelector("#modalWinner2").textContent = "Remove";
    document.querySelector("#modalWinnerText2").textContent = allWinnerAnimal[1].name;
    document.querySelector("#modalWinner2").classList.remove("hide");
    } else {
    document.querySelector(".modalHeader").textContent = "You can only have one Type!";
    document.querySelector(".modalText").textContent = "Only one type";
    document.querySelector("#modalWinner1").textContent = "Remove";
    }

}

function checkType (animal) {
    if (allWinnerAnimal.length == 0 ) {
        return true;
    } else if (animal.type == allWinnerAnimal[0].type ) {
        console.log("you cant do this");
        displayModalTwo();
        return false;
    } else if (allWinnerAnimal.length == 1 ) {
        return true ;
    } else if (animal.type == allWinnerAnimal[0].type , animal.type == allWinnerAnimal[1].type ) {
        console.log("you cant so this");
        displayModalTwo();
        return false
    } else {
        return true
    }
}

function isLoser (animal) {
    console.log("its around here");
    if (animal.winner == false) {
        return false;
    } else {
        return true;
    }
}

function isCat(animal) {
    if (animal.type === "cat") {
        return true;
    } else {
        return false;
    }
}

function isDog(animal) {
    if (animal.type === "dog") {
        return true;
    } else {
        return false;
    }
}

// function isAll(animal) {
//     if (animal.type === "all") {
//         return true;
//     } else {
//         return false;
//     }
// }

// function compareName(animalA, animalB) {
//     if (animalA.name < animalB.name) {
//         return -1;
//     } else {
//         return 1;
//     }
// }

function sortList(sortBy) {
    let sortList = allAnimals;

    if (sortBy === "name") {
        sortedList = sortedList.sort(sortByName);
    } else if (sortBy ===  "type") {
        sortList = sortedList.sort(sortByType);
    }
    displayList(sortedList);
}