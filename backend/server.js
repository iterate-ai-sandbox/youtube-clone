const express = require("express");
const router = require("./Router/router");
const app = express();
const path = require("path");
const port = 3000;
const bodyParser = require("body-parser");
const cors = require("cors");
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Middlewares
app.use(
  cors({
    origin: "http://iterate.rkph.me",
    // allowedHeaders: [
    //   "Content-Type",
    //   "Authorization",
    //   "Origin",
    //   "X-Requested-With",
    //   "Accept",
    // ],
    // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(router);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
