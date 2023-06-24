const express = require("express");
const cors = require("cors");
const addEvent = require("./API/addEvent");
const getEvent = require("./API/getEvent");
const editEvent = require("./API/editEvent");
const deleteEvent = require("./API/deleteEvent");

const addUser = require("./API/addUser");
const editUser = require("./API/editUser");
const deleteUser =require("./API/deleteUser");
const getUserInformation = require("./API/getUserInformation");
const getUserID = require("./API/getUserID");

const getCities = require("./API/getCities");
const getCategories = require("./API/getCategories");
const getEventByLocation = require("./API/getEventByLocation");

const addClick = require("./API/addClick");

const addFavouriteList = require("./API/addFavouriteList");
const editFavouriteList = require("./API/editFavouriteList");
const getFavouriteLists = require("./API/getFavouriteLists");

const addFavourite = require("./API/addFavourite");
const deleteFavourite = require("./API/deleteFavourite");
const getFavourites = require("./API/getFavourites");
const deleteFavouriteList = require("./API/deleteFavouriteList");

const addUpdate = require("./API/addUpdate");
const getUpdates = require("./API/getUpdates");
const deleteUpdate = require("./API/deleteUpdate");
const editUpdate = require("./API/editUpdate");

const addImageToEvent = require("./API/addImageToEvent");

const getmetrics = require("./API/pgExport");

const addImage = require("./API/addImage");
const editImageSet = require("./API/editImageSet");
const deleteImageSet = require("./API/deleteImageSet");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/add-event", addEvent);
app.use("/get-event", getEvent);
app.use("/edit-event", editEvent);
app.use("/delete-event", deleteEvent);

app.use("/add-user", addUser);
app.use("/edit-user", editUser);
app.use("/delete-user", deleteUser);
app.use("/get-user-information", getUserInformation);
app.use("/get-user-id", getUserID);

app.use("/get-cities", getCities);
app.use("/get-categories", getCategories);
app.use("/get-event-by-location", getEventByLocation);

app.use("/add-click", addClick);

app.use("/add-favourite-list", addFavouriteList);
app.use("/edit-favourite-list", editFavouriteList);
app.use("/get-favourite-lists", getFavouriteLists);

app.use("/add-favourite", addFavourite);
app.use("/delete-favourite", deleteFavourite);
app.use("/get-favourites", getFavourites);
app.use("/delete-favourite-list", deleteFavouriteList);

app.use("/add-update", addUpdate);
app.use("/get-updates", getUpdates);
app.use("/edit-update", editUpdate);
app.use("/delete-update", deleteUpdate);

app.use("/add-image-to-event", addImageToEvent);
app.use("/edit-image-set", editImageSet);
app.use("/delete-image-set", deleteImageSet);

app.use("/metrics", getmetrics);

app.use(express.static('images'));

app.post('/add-image', addImage.uploadImage);

app.listen(4000, () => console.log("Server on localhost:4000"));
