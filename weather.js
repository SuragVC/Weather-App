let append = document.getElementById("append_div")
let broadcaster_div = document.getElementById("broadcaster")

let iframe = document.querySelector("#gmap_canvas")

let real_time;
let date;
// ______________________form submit function______________________________________
async function TurnOn() {
    append.innerHTML = null
    broadcaster_div.innerHTML = null

    loading_img = document.createElement("img")
    loading_img.setAttribute("class", "loading_image")
    loading_img.src = "https://t4.ftcdn.net/jpg/02/05/40/33/240_F_205403329_q4rxr712Fmc8shTG9RTzRWmy2ghYU7iA.jpg"
    append.append(loading_img)

    let city = document.querySelector("#city").value;

    let result_Cacth = timeCall(city)
    let result_sum = await result_Cacth

    if (result_sum == "false") {
        real_time = "Not Available"
        date = "Not Available"
    } else {
        result_sum = result_sum.split(" ")
        real_time = result_sum[1]
        date = result_sum[0]
    }

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=eee39db81dc35339a8657fb4c7585b75`
    try {
        let response = await fetch(url)
        let result = await response.json()

        displayData(city, result.main, result.wind, date, real_time)
        locationMap(city)
        futureBroadcast(city)
    } catch (err) {
        append.innerHTML = null

        h3 = document.createElement("h3")
        h3.innerText = "Sorry!"
        h3.style.color = "white"
        h3_2 = document.createElement("h3")
        h3_2.innerText = "Data is not available"
        h3_2.style.color = "white"
        append.append(h3, h3_2)
    }

}

// ______________________Time function_________________________________________
async function timeCall(city) {
    let time_url = `https://timezone.abstractapi.com/v1/current_time/?api_key=1de1bbf3d7774492a86cf9d91182f61d&location=${city}`
    let y;
    let p;
    try {
        let time_result = await fetch(time_url)
        let time = await time_result.json()
        p = (time.datetime)
        if (p == undefined) {
            p = "false"
        }

        return (p)
    } catch (err) {
        y = "false"
        return y
    }
}


// ______________________display function__________________________________________
function displayData(city, data, wind, date, real_time) {
    append.innerHTML = null;

    let div = document.createElement("div")
    image_m = document.createElement("img")
    image_m.setAttribute("class", "sun_moon")
    let arr = real_time.split(":")
    let hours = arr[0]

    if (hours >= 6 && hours <= 18) {
        image_m.src = "https://images.pexels.com/photos/209807/pexels-photo-209807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    } else {
        image_m.src = "https://cdn.pixabay.com/photo/2021/06/26/06/52/moon-6365467__340.jpg"
    }

    div.style.backgroundColor = "white"

    let name = document.createElement("h3")
    name.innerText = `Name: ${city.toUpperCase()}`;

    let temp = document.createElement("p")
    temp.innerText = `Temperature: ${data.temp}`

    let max_temp = document.createElement("p")
    max_temp.innerText = `Max Temperature: ${data.temp_max}`

    let min_temp = document.createElement("p")
    min_temp.innerText = `Min Temperature: ${data.temp_min}`

    let today = document.createElement("p")
    today.innerText = `Date: ${date}`
    let Real_time = document.createElement("p")
    Real_time.innerText = `Time: ${real_time}`

    let wind_data = document.createElement("div")
    wind_data.setAttribute("class", "wind")
    let speed = document.createElement("p")
    speed.innerText = `Wind = Speed:${wind.speed==undefined ? "Not Available":wind.speed}`

    let deg = document.createElement("p")
    deg.innerText = `Deg: ${wind.deg ==undefined ? "Not Available":wind.deg}`

    let dust = document.createElement("p")
    dust.innerText = `Gust:${wind.gust ==undefined ?"Not Available":wind.gust }`

    wind_data.append(speed, deg, dust)

    div.append(image_m, name, temp, max_temp, min_temp, Real_time, today, wind_data)
    append.append(div)
}

function locationMap(city) {
    iframe.src = `https://maps.google.com/maps?q=${city}&t=k&z=13&ie=UTF8&iwloc=&output=embed`
}
async function futureBroadcast(city) {

    let broadcast_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=eee39db81dc35339a8657fb4c7585b75`
    let b = await fetch(broadcast_url)
    let broadcast = await b.json()
    BroadCastAppender(broadcast)

}

function BroadCastAppender(data) {

    let Days = []

    for (let i = 0; i < 6; i++) {
        Days.push(data.list[i])
    }
    Days.forEach(function(elem) {

        let main_div = document.createElement("div")

        let b_date = document.createElement("p")
        b_date.innerText = `Date :${elem.dt_txt}`

        let f_temp = document.createElement("p")
        f_temp.innerText = `Max Temp:${elem.main.temp_max}`

        let l_temp = document.createElement("p")
        l_temp.innerText = `Max Temp:${elem.main.temp_min}`

        main_div.append(b_date, f_temp, l_temp)
        broadcaster_div.append(main_div)
    })
}