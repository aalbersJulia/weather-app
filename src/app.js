// core modules
const path = require("path");
// npm modules
const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

// define paths for Express config
// console.log(path.join(__dirname, "../public"));
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
// setup static directory to serve
app.use(express.static(path.join(__dirname, "../public")));

app.get("", (req, res) => {
    res.render("index", {
        title: "Weather",
        name: "Julia",
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Me",
        name: "Julia",
    });
});

app.get("/help", (req, res) => {
    res.render("help", {
        helpText: "this is some helpful text.",
        title: "Help",
        name: "Julia",
    });
});

app.get("/weather", (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide an address",
        });
    }

    geocode(
        req.query.address,
        (error, { latitude, longitude, location } = {}) => {
            if (error) {
                return res.send({
                    error,
                });
            }

            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({
                        error,
                    });
                }

                return res.send({
                    forecast: forecastData,
                    location,
                    address: req.query.address,
                });
            });
        }
    );
});

app.get("/products", (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: "You must provide a search term",
        });
    }

    res.send({
        products: [],
    });
});

app.get("/help/*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Julia",
        errorMessage: "Help article not found.",
    });
});

app.get("*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Julia",
        errorMessage: "Page not found.",
    });
});

// start server listening on port 3000
app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});
