'use strict';

const express = require("express");
const app = express();
const ejs = require("ejs");
const axios = require("axios");
const cheerio = require("cheerio");
const apiKey = "d965f383bcb2a8534bde2bccca1f1c5e";
const unit = "metric";


const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


//This code sets the view engine to EJS using app.set('view engine', 'ejs').
app.set('view engine', 'ejs');


app.get("/", (req, res) => {

    let cityName = '';
    let cityQuery = req.url;



    const url = axios.get("https://api.ipify.org/?format=json")

    url

        .then((response) => {
            const d = new Date();
            let day = weekday[d.getDay()];
            const ip = response.data.ip;

            console.log(ip);




            const url = axios.get(`https://tools.keycdn.com/geo?host=${ip}`);



            url

                .then((response) => {
                    const data = response.data;
                    const $ = cheerio.load(data);
                    cityName = $("dl > dd").html();

                    if (cityQuery.includes("cityName")) {
                        cityName = cityQuery.slice(11);
                        cityName = cityName.replace(/\+/g, ' ');

                    }
                    console.log(cityName);


                    const url = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${apiKey}`);

                    url

                        .then((response) => {

                            const weatherData = response.data;
                            const temp = Math.round(weatherData.main.temp);
                            console.log(temp);
                            const weatherDescription = weatherData.weather[0].description;
                            const icon = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

                            //Create a route for your HTML page that renders the EJS template:
                            res.render('index', {
                                currentDay: day,
                                currentCity: cityName,
                                weatherIcon: icon,
                                currentTemp: temp,
                                weather: weatherDescription

                            })

                        })
                        .catch((err) => {
                            res.write('<div style="text-align: center;">');
                            res.write('<h1 style="color: red;">Error! City not found!</h1>');
                            res.write('<button onclick="myFunction()" style="background-color: red; color: white; font-size: 1.2em; padding: 0.5em 1em; border: none; border-radius: 0.5em; margin-top: 1em; cursor: pointer;">Try again</button>');
                            res.write('</div>');
                            res.write('<script>');
                            res.write('function myFunction() {');
                            res.write('window.location.href = "/";');
                            res.write('}');
                            res.write('</script>');
                            res.send();
                            console.error(err);
                        })


                })
                .catch((err) => {
                    console.error(err);
                })

        })
        .catch(err => {
            console.error(err);
        })

})

app.post("/form-submit", (req, res) => {


    // Redirect the user back to the home page
    res.redirect("/");
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})