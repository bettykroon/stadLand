export function renderCityInfo(chosenCity){
    let cityContainer = document.getElementById("cities");
    cityContainer.addEventListener("click", function(e){
        console.log("KLICK");
        //console.log(e.target.id);
        cityContainer.innerHTML = "";
        // Kollar om id på staden jag tryckt på är samma som något av städernas id i stad.json
        console.log(e.target.id);
        if(chosenCity){
            for(let i = 0; i < chosenCity.length; i++){
                if(e.target.id == chosenCity[i].id){
                    console.log(chosenCity[i].id);
                    // Skriver ut stadens namn samt antalet invånare
                    // Skapar även en knapp som du trycker på om du besökt staden
                    let cityInfo = document.getElementById("cityInfo");
                    cityInfo.innerHTML = `<strong>${chosenCity[i].stadname}</strong> <br> Antalet invånare: ${chosenCity[i].population} <br> <p id="haveYouVisited">Har du besökt denna stad?</> <br> <button id="yes">JA</button>`;
        
                    // Väder API
                    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + chosenCity[i].stadname + "&appid=9cff4516de5bb7e06dd5fd8502b1b6d8&lang=sv")
                    .then(response => response.json())
                    .then(data => {
                        //console.log(data);
                        let weatherContainer = document.getElementById("weatherContainer");
                        weatherContainer.innerHTML = "";
                        let nameValue = data['name'];
                        let tempValue = data['main']['temp'];
                        let kelvinToCelsius = tempValue - 273.15;
                        let temp = kelvinToCelsius.toFixed(2);
                        let descValue = data['weather'][0]['description'];
        
                        weatherContainer.innerHTML += "Vädret i " + nameValue + " idag är: <br>" + temp + " grader och " + descValue;
                    })
                    .catch(err => alert("ERROR"));
    
                    //Wiki API
                    fetch("https://sv.wikipedia.org/w/rest.php/v1/search/page?q=" + chosenCity[i].stadname + "&limit=1")
                    .then(response => response.json())
                    .then(data => {
                        //console.log(data);
                        let cityDetailsContainer = document.getElementById("cityDetailsContainer");
                        cityDetailsContainer.innerHTML = "";
    
                        let cityWikiInfo = document.createElement("div");
                        cityWikiInfo.innerText = data.pages[0].description;
    
                        let cityThumbnail = document.createElement("img");
                        cityThumbnail.alt = chosenCity.stadname;
                        cityThumbnail.src = data.pages[0].thumbnail.url
                        cityThumbnail.className = "cityThumbnail";
    
                        cityDetailsContainer.append(cityWikiInfo, cityThumbnail);
    
                    })
                    .catch(err => alert("ERROR"));
    
                    // Om du trycker JA att du besökt staden
                    document.getElementById("yes").addEventListener("click", function(){
                        // Sparar stadens id i LS
                        let visitedCities = JSON.parse(localStorage.getItem("visited"));
                        if(visitedCities == null) { visitedCities = [];}
                        let visitedCity = { "id": chosenCity[i].id};
                        localStorage.setItem("city", JSON.stringify(visitedCity));
                        visitedCities.push(visitedCity);
                        localStorage.setItem("visited", JSON.stringify(visitedCities));
                        //console.log("Besökta städer: ", localStorage.getItem("visited"));
                        document.getElementById("haveYouVisited").style.visibility = "hidden";
                    })
                    // Dölj knappen om staden finns i LS
                    let cityInLs = JSON.parse(localStorage.getItem("visited"));
                    if(cityInLs != null){
                        for(let i = 0; i < cityInLs.length; i++){
                            // Döljer knappen "har du besökt staden" i de städer jag har besökt
                            if(e.target.id == JSON.parse(localStorage.getItem("visited"))[i].id){
                                document.getElementById("haveYouVisited").style.visibility = "hidden";
                            } 
                        }
                    }
                }
            }
        }
    })
}