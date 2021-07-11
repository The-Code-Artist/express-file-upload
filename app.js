const express = require("express");
const handlebars = require("express-handlebars");
const fileUpload = require("express-fileupload");

const app = express();
const port = process.env.PORT || 3000;

app.use(fileUpload());

app.engine("hbs", handlebars({ extname: ".hbs" }));
app.set("view engine", "hbs");

app.get("", (req, res) => {
    res.render("index");
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

            res.send("File upload succesful.");
        });
    }
});

app.listen(3000, () => console.log(`App is running on port ${port}.`));
