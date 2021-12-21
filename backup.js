window.addEventListener("load", initSite);

let countriesFromThen;
let citiesFromThen;

async function initSite() {
    let countries = await makeRequest("./json/land.json");
    let cities = await makeRequest("./json/stad.json");
    renderCountriesAndCities(countries, cities);
}

async function makeRequest(url) {
    try {
        let response = await fetch(url);
        let result = await response.json();
        return result;
    } catch(err) {
        console.error(err);
    }
}

function renderCountriesAndCities(countries, cities) {
    // I diven "countryContainer" lägger jag till en rubrik "Städer jag har besökt" 
    let countryContainer = document.getElementById("countryContainer");
    let citiesIHaveVisited = document.createElement("h2");
    citiesIHaveVisited.id = "visitedCities";
    citiesIHaveVisited.innerText = "Städer jag har besökt";
    countryContainer.append(citiesIHaveVisited);

    // När man trycker på rubriken "Städer jag har besökt"
    document.getElementById("visitedCities").addEventListener("click", function(){
        // Tömmer först diven
        let cityContainer = document.getElementById("cities");
        cityContainer.innerHTML = "";
        cityInfo.innerHTML = "";
        let header = document.createElement("h4");
        header.innerHTML = "Städer jag har besökt:";
        let visitedCitiesContainer = document.createElement("div");
        // Hämtar de städer jag har besökt från LS
        let visitedCitiesName = JSON.parse(localStorage.getItem("visitedName"));
        for(let i = 0; i < visitedCitiesName.length; i++){
            // Skriver ut städerna jag har besökt
            visitedCitiesContainer.innerHTML += JSON.parse(localStorage.getItem("visitedName"))[i].Stad + "<br>";
        }
        // Skapar en reset knapp som tar bort de städer jag sparat i LS
        let resetVisitedCities = document.createElement("button");
        resetVisitedCities.id = "resetBtn";
        resetVisitedCities.innerText = "Nollställ städer!";
        cityInfo.append(header, visitedCitiesContainer, resetVisitedCities);
        //console.log(JSON.parse(localStorage.getItem("visitedName"))[0].Stad);

        document.getElementById("resetBtn").addEventListener("click", function(){
            localStorage.clear();
            location.reload();
        })
    })

    // Skriver ut de länder som finns i land.json
    countries.forEach((country) => {
        let countryHeader = document.createElement("h2");
        countryHeader.innerText = country.countryname;
        countryHeader.id = country.id;
        console.log(countryHeader.id);
        countryContainer.append(countryHeader);

        // När man trycker på något av länderna i diven "countryContainer"
        document.getElementById("countryContainer").addEventListener("click", function(e){
            //console.log(e.target.id);
            // Kollar om id på landet jag tryckt på är samma som något av ländernas id i land.json
            if(e.target.id == countryHeader.id){
                let cityContainer = document.getElementById("cities");
                cityContainer.innerHTML = "";
                let cityInfo = document.getElementById("cityInfo");
                cityInfo.innerHTML = "";
                // Om ja så skriver jag ut städerna för det landet
                cities.forEach((city) => {
                    // Om country.id är samma som city.countryid betyder det att staden finns i det landet
                    if(country.id == city.countryid) {
                        let cityHeader = document.createElement("h4");
                        cityHeader.innerHTML = city.stadname;
                        cityHeader.id = city.id;
                        cityContainer.append(cityHeader);

                        // Om jag trycker på någon av städerna
                        document.getElementById("cities").addEventListener("click", function(e){
                            //console.log(e.target.id);
                            cityContainer.innerHTML = "";
                            // Kollar om id på staden jag tryckt på är samma som något av städernas id i stad.json
                            if(e.target.id == cityHeader.id){
                                // Skriver ut stadens namn samt antalet invånare
                                // Skapar även en knapp som du trycker på om du besökt staden
                                cityInfo.innerHTML = `<strong>${city.stadname}</strong> <br> Antalet invånare: ${city.population} <br> <p id="haveYouVisited">Har du besökt denna stad?</> <br> <button id="yes">JA</button>`;
                                // Om du trycker JA att du besökt staden
                                document.getElementById("yes").addEventListener("click", function(){
                                    // Sparar stadens id i LS
                                    let visitedCities = JSON.parse(localStorage.getItem("visited"));
                                    if(visitedCities == null) { visitedCities = [];}
                                    let visitedCity = { "id": city.id};
                                    localStorage.setItem("city", JSON.stringify(visitedCity));
                                    visitedCities.push(visitedCity);
                                    localStorage.setItem("visited", JSON.stringify(visitedCities));
                                    console.log("Besökta städer: ", localStorage.getItem("visited"));

                                    // Sparar stadens namn och invånarantal i LS
                                    let visitedCitiesName = JSON.parse(localStorage.getItem("visitedName"));
                                    if(visitedCitiesName == null) { visitedCitiesName = [];}
                                    let visitedCityName = { "Stad": city.stadname, "Invånare": city.population};
                                    localStorage.setItem("cityName", JSON.stringify(visitedCityName));
                                    visitedCitiesName.push(visitedCityName);
                                    localStorage.setItem("visitedName", JSON.stringify(visitedCitiesName));
                                    console.log("Besökta städer: ", localStorage.getItem("visitedName"));

                                    document.getElementById("haveYouVisited").style.visibility = "hidden";
                                })
                            }
                        })
                    }
                });
            }
        })
    });
}