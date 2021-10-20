const express = require("express");
const fs = require("fs");
const data = require("./data.json");
const { join } = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.options("*", cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

const path = "/api/v1/student/";

app.get(path, (req, res) => {
  return res.status(200).json({
    status: "success",
    students: data.contactList,
  });
});

app.get(`${path}:id`, (req, res) => {
  const id = req.params.id * 1;
  const index = data.contactList.findIndex((cur) => cur.id === id);
  if (index === -1)
    return res.status(404).json({
      status: "fail",
      message: "record not found",
    });

  return res.status(200).json({
    status: "success",
    student: data.contactList[index],
  });
});

app.post(path, async (req, res) => {
  const { contactList } = data;
  const student = {
    id: Math.floor(Math.random() * 10000000000000000),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    age: req.body.age,
    eyeColor: req.body.eyeColor,
    handedness: req.body.handedness,
    time: Date.now(),
    createdBy: req.body.createdBy,
  };
  contactList.push(student);
  const contactListString = JSON.stringify({ contactList }, null, 2);
  try {
    await fs.writeFileSync(join(__dirname, "data.json"), contactListString);

    return res.status(201).json({ status: "success", student });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: "fail", message: "oops something went wrong" });
  }
});

app.post(`${path}:id`, async (req, res) => {
  const id = req.params.id * 1;
  const { contactList } = data;
  const index = contactList.findIndex((cur) => cur.id === id);
  if (index === -1)
    return res.status(401).json({
      status: "fail",
      message: "record not found",
    });

  const student = {
    ...contactList[index],
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    age: req.body.age,
    eyeColor: req.body.eyeColor,
    handedness: req.body.handedness,
  };
  contactList[index] = student;
  const contactListString = JSON.stringify({ contactList }, null, 2);
  try {
    await fs.writeFileSync(join(__dirname, "data.json"), contactListString);
    return res.status(201).json({ status: "success", student });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: "fail", message: "oops something went wrong" });
  }
});

app.listen(3001, () => {
  console.log("listening on port 3001");
});
