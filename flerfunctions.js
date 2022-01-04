Promise.all([
    fetch("./json/land.json").then(response => response.json()),
    fetch("./json/stad.json").then(response => response.json()),
])
    .then(jsonData => {
        let countries = jsonData[0];
        let cities = jsonData[1];
        renderVisitedCities(cities);
        renderCountries(countries);
        renderCities(cities);
    });

import { renderCityInfo } from './modules/cityInfo.mjs';
renderCityInfo();

function renderCountries(countries){
    countries.forEach((country) => {
        let countryHeader = document.createElement("h2");
        countryHeader.innerText = country.countryname;
        countryHeader.id = country.id;
        countryContainer.append(countryHeader);
    })
}

function renderCities(cities){
    let countryContainer = document.getElementById("countryContainer");
    countryContainer.addEventListener("click", function(e){
        weatherContainer.innerHTML = "";
        cityDetailsContainer.innerHTML = "";
        let cityContainer = document.getElementById("cities");
        cityContainer.innerHTML = "";
        cities.forEach((city) => {
            // Om e.target.id är samma som city.countryid betyder det att staden finns i det landet
            if(city.countryid == e.target.id) {
                cityInfo.innerHTML = "";
                let cityContainer = document.getElementById("cities");
                let cityHeader = document.createElement("h4");
                cityHeader.innerHTML = city.stadname;
                cityHeader.id = city.id;
                cityContainer.append(cityHeader);
            }
        })
        renderCityInfo(cities);
    })
}

function renderVisitedCities(cities){
    // I diven "countryContainer" lägger jag till en rubrik "Städer jag har besökt" 
    let citiesIHaveVisited = document.createElement("h2");
    citiesIHaveVisited.id = "visitedCities";
    citiesIHaveVisited.innerText = "Städer jag har besökt";
    countryContainer.append(citiesIHaveVisited);

    // När man trycker på rubriken "Städer jag har besökt"
    document.getElementById("visitedCities").addEventListener("click", function(){
        if(localStorage.length == 0){
            cityInfo.innerHTML = "Du har inte besökt några städer..";
        }else {
            // Tömmer först diven
            let cityContainer = document.getElementById("cities");
            cityContainer.innerHTML = "";
            cityInfo.innerHTML = "";
            weatherContainer.innerHTML = "";
            cityDetailsContainer.innerHTML = "";
            let header = document.createElement("h4");
            header.innerHTML = "Städer jag har besökt:";
            let visitedCitiesContainer = document.createElement("div");
            visitedCitiesContainer.id = "visitedCitiesContainer";
            // Hämtar de städer jag har besökts id från LS
            let visitedCities = JSON.parse(localStorage.getItem("visited"));
            for(let i = 0; i < visitedCities.length; i++){
                // Skriver ut städerna jag har besökt
                cities.forEach((city) => {
                    if(JSON.parse(localStorage.getItem("visited"))[i].id == city.id){
                        visitedCitiesContainer.innerHTML += city.stadname + "<br>";
                    }
                })
            }
            // Skapar en reset knapp som tar bort de städer jag sparat i LS
            let resetVisitedCities = document.createElement("button");
            resetVisitedCities.id = "resetBtn";
            resetVisitedCities.innerText = "Nollställ städer!";

            // Totala antalet invånare i samtliga länder jag besökt
            let totalNumberInhabitantsHeader = document.createElement("h4");
            totalNumberInhabitantsHeader.innerText = "Antal invånare totalt: ";
            let totalNumberInhabitants = document.createElement("div");
            totalNumberInhabitants.id = "totalNumberInhabitants";
            totalNumberInhabitants = 0;

            // Räkna ut totalt antal invånare 
            for(let i = 0; i < visitedCities.length; i++){
                cities.forEach((city) => {
                    if(JSON.parse(localStorage.getItem("visited"))[i].id == city.id){
                        let population = city.population;
                        totalNumberInhabitants += population;
                    }
                })
            }

            cityInfo.append(header, visitedCitiesContainer, resetVisitedCities,totalNumberInhabitantsHeader, totalNumberInhabitants);
            //console.log(JSON.parse(localStorage.getItem("visited"))[0].id);

            document.getElementById("resetBtn").addEventListener("click", function(){
                localStorage.clear();
                location.reload();
            })
        }
    })      
}