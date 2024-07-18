const searchButton = document.querySelector("#search");
const searchInput = document.querySelector("#keyword");
const clearInput = document.querySelector("#clear");
clearInput.addEventListener("click",()=>{
    searchInput.value = "";
    renderResult([])
})
searchButton.addEventListener("click",()=>{
    //console.log(searchInput.value);
    const key = searchInput.value?.toLowerCase();
    fetch("/travel_recommendation.json").then(data=>{
        if(!data.ok){
             throw new Error("api error")
        }
        return data.json();
    }).then(result=>{
        handleResult(result,key);
    }).catch(err=>{
        console.log(err);
    })
})

function handleResult(obj,key){
    let result = []
    // search beaches and temples
    let scene = ["beaches","temples"];
    scene.forEach(item=>{
        if(item.toLocaleLowerCase().indexOf(key) >=0){
            result = obj[item]
        }
    })
    if(result.length){
        renderResult(result);
        return ;
    }

    //search country or city
    obj.countries.forEach(item=>{
        if(item.name.toLowerCase().indexOf(key) >=0){
            result = item.cities;
        }
    })
    if(result.length){
        renderResult(result);
        return ;
    }


    //search city

    obj.countries.forEach(item=>{
        item.cities.forEach(city=>{
            if(city.name.toLocaleLowerCase().indexOf(key) >=0){
                result = [city]
            }
        })
    })
    if(result.length){
        renderResult(result);
        return ;
    }


}

function renderResult(list){
    let htmlStr = ""
    if(list.length ){
        list.forEach(item=>{
            htmlStr  = htmlStr + `
                   <div class="result-card" >
                    <img src="${item.imageUrl}" alt="" class="picture">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <button class="button">Visit</button>
                </div>
            `
        })

    }
    document.querySelector(".search-result").innerHTML = htmlStr;
}