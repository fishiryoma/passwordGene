const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// ----------------------------------------------------

app.get("/", (req, res) => {
  res.redirect("/pwgenerator");
});

app.get("/pwgenerator", (req, res) => {
  res.render("index");
});

app.post("/pwgenerator", (req, res) => {
  const option = req.body;
  const generatedPW = pwGenerator(option);
  res.render("index", { generatedPW, option });
});

app.listen(port, () => {
  console.log(`express is running on http://localhost:${port}`);
});

function pwGenerator(formbody) {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "1234567890";
  const symbols = "~!@#$%^&*()_+";

  let stringset = "";
  let password = "";
  if (formbody.lowercase) stringset += lowercase;
  if (formbody.uppercase) stringset += uppercase;
  if (formbody.includeNum) stringset += nums;
  if (formbody.includeSymbol) stringset += symbols;
  stringset = [...stringset];
  if (!stringset.length)
    return "There is no valid characters in your selection.";
  if (formbody.excludeChar) {
    stringset = stringset.filter((a) => !formbody.excludeChar.includes(a));
  }

  for (let i = 0; i < formbody.pwlength; i++) {
    const randomNum = Math.floor(Math.random() * stringset.length);

    password += stringset[randomNum];
  }

  return password;
}
