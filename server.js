const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let employees = [
  {
    id: 1,
    name: "Иван Иванов",
    position: "Разработчик",
    department: "IT",
    salary: 120000,
  },
  {
    id: 2,
    name: "Мария Петрова",
    position: "Аналитик",
    department: "Аналитика",
    salary: 95000,
  },
  {
    id: 3,
    name: "Алексей Сидоров",
    position: "Менеджер",
    department: "Продажи",
    salary: 110000,
  },
];
let nextId = 4;

app.get("/employees", (req, res) => {
  res.json(employees);
});

app.get("/employees/:id", (req, res) => {
  const employee = employees.find((item) => item.id === Number(req.params.id));
  if (!employee) {
    return res.status(404).json({ error: "Сотрудник не найден" });
  }
  res.json(employee);
});

app.post("/employees", (req, res) => {
  const { name, position, department, salary } = req.body;
  if (!name || !position) {
    return res.status(400).json({ error: "Поля name и position обязательны" });
  }

  const employee = {
    id: nextId++,
    name,
    position,
    department: department || "",
    salary: salary || 0,
  };
  employees.push(employee);
  res.status(201).json(employee);
});

app.put("/employees/:id", (req, res) => {
  const index = employees.findIndex(
    (item) => item.id === Number(req.params.id),
  );
  if (index === -1) {
    return res.status(404).json({ error: "Сотрудник не найден" });
  }

  const { name, position, department, salary } = req.body;
  employees[index] = {
    ...employees[index],
    ...(name && { name }),
    ...(position && { position }),
    ...(department !== undefined && { department }),
    ...(salary !== undefined && { salary }),
  };
  res.json(employees[index]);
});

app.delete("/employees/:id", (req, res) => {
  const index = employees.findIndex(
    (item) => item.id === Number(req.params.id),
  );
  if (index === -1) {
    return res.status(404).json({ error: "Сотрудник не найден" });
  }

  const [deleted] = employees.splice(index, 1);
  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
