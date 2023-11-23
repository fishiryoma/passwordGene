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
  const pwlength = req.body.pwlength;
  const checkLowercase = req.body.lowercase;
  const checkUppercase = req.body.uppercase;
  const checkNumber = req.body.includeNum;
  const checkSymbol = req.body.includeSymbol;
  const excludeCharacter = req.body.excludeChar;
  const generatedPW = pwGenerator(
    pwlength,
    checkLowercase,
    checkUppercase,
    checkNumber,
    checkSymbol,
    excludeCharacter
  );

  res.render("index", { generatedPW });
});

app.listen(port, () => {
  console.log(`express is running on http://localhost:${port}`);
});

function pwGenerator(
  pwlength,
  checkLowercase,
  checkUppercase,
  checkNumber,
  checkSymbol,
  excludeCharacter
) {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "1234567890";
  const symbols = "~!@#$%^&*()_+";

  let stringset = "";
  let password = "";

  if (checkLowercase) stringset += lowercase;
  if (checkUppercase) stringset += uppercase;
  if (checkNumber) stringset += nums;
  if (checkSymbol) stringset += symbols;
  stringset = [...stringset];
  if (excludeCharacter) {
    stringset = stringset.filter((a) => !excludeCharacter.includes(a));
  }

  for (let i = 0; i < pwlength; i++) {
    const randomNum = Math.floor(Math.random() * (stringset.length + 1));
    password += stringset[randomNum];
  }
  return password;
}
