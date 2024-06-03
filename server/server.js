const PORT = process.env.PORT ?? 8000;
const express = require("express");
const app = express();
const dbService = require("./db");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

app.use(cors());
app.use(express.json());
//get todos from db
app.get("/todos/:userEmail", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { userEmail } = req.params;
  const results = db.getUserInfo(userEmail);
  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

app.post("/todos", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { user_email, title, progress, date } = req.body;
  const id = uuidv4();
  const results = db.postNewTask(id, user_email, title, progress, date);
  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

app.put("/todos/edit/:id", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { user_email, title, progress, date } = req.body;
  const { id } = req.params;
  const results = db.updateTask(id, user_email, title, progress, date);
  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

app.delete("/todos/delete/:id", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { id } = req.params;
  const results = db.deleteTask(id);
  results
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});

// signup
app.post("/signup", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const results = db.signUp(email, hashedPassword);
  results
    .then(() => res.json({ message: "Signup successful" }))
    .catch((err) => {
      console.error(err);
      res.json("error");
    });
});

app.post("/login", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { email, password } = req.body;
  const results = db.logIn(email);
  results
    .then((data) => {
      if (!data.length) {
        return res.json({ detail: "Either Email or Password does not match!" });
      }
      const success = bcrypt.compare(password, data[0].hashed_password);
      const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
      success
        .then((match) => {
          if (match) {
            res.json({ email, token });
          }
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
