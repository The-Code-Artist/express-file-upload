const express = require("express");
const handlebars = require("express-handlebars");
const fileUpload = require("express-fileupload");
const mysql = require("mysql");

const app = express();
const port = process.env.PORT || 3000;

app.use(fileUpload());
app.use(express.static("public"));
app.use(express.static("uploads"));

app.engine("hbs", handlebars({ extname: ".hbs" }));
app.set("view engine", "hbs");

// Define a MySQL connection pool.
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  port: 3306,
  password: "vzp46@BXD$",
  database: "express_uploaddb",
});

app.get("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) console.error(err);
    else {
      console.log("Connected to mySQL.");
      connection.query(
        'SELECT name, profile_image, job_title, description FROM user WHERE id = "1"',
        (err, rows) => {
          // Release the connection once done.
          connection.release();

          if (!err) {
            res.render("index", { rows });
          } else
            console.error(err);
        });
    }
  });
});

app.post("", (req, res) => {
  let image;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0)
    return res.status(400).send("Please select an image to upload.");
  else {
    image = req.files.image;
    uploadPath = `${__dirname}/uploads/${image.name}`;
    console.log(image);

    //
    image.mv(uploadPath, (err) => {
      if (err) return res.status(500).send(err);

      pool.getConnection((err, connection) => {
        if (err) console.log(err);
        else {
            connection.query(
              'UPDATE user SET profile_image = ? WHERE id = "1"',
              [image.name],
              (err, rows) => {
                // Release the connection once done.
                connection.release();

                if (!err) {
                  res.redirect("/");
                } else console.error(err);
              }
            );
        }
      });
    });
  }
});

app.listen(3000, () => console.log(`App is running on port ${port}.`));
