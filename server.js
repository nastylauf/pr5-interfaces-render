const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const redoc = require("redoc-express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ==================== In-memory "база" сотрудников ====================
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

// ==================== CRUD маршруты (Практика 5) ====================

// GET /employees — список всех сотрудников
app.get("/employees", (req, res) => {
  res.json(employees);
});

// GET /employees/:id — один сотрудник
app.get("/employees/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const employee = employees.find((e) => e.id === id);
  if (!employee) {
    return res.status(404).json({ error: "Сотрудник не найден" });
  }
  res.json(employee);
});

// POST /employees — добавить нового
app.post("/employees", (req, res) => {
  const { name, position, department, salary } = req.body;
  if (!name || !position) {
    return res.status(400).json({ error: "Поля name и position обязательны" });
  }
  const newEmployee = {
    id: nextId++,
    name,
    position,
    department: department || "",
    salary: salary || 0,
  };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

// PUT /employees/:id — обновить
app.put("/employees/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = employees.findIndex((e) => e.id === id);
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

// DELETE /employees/:id — удалить
app.delete("/employees/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = employees.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Сотрудник не найден" });
  }
  const deleted = employees.splice(index, 1)[0];
  res.json(deleted);
});

// ==================== Документация (Практика 6) ====================

const swaggerDocument = YAML.load(path.join(__dirname, "openapi.yaml"));

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "Employees API – Swagger",
  }),
);

// ReDoc (трёхпанельная документация)
app.get(
  "/redoc",
  redoc({
    title: "Employees API – ReDoc",
    specUrl: "/openapi.yaml",
    redocOptions: {
      theme: { colors: { primary: { main: "#1976d2" } } },
    },
  }),
);

// Отдаём сам файл спецификации
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "openapi.yaml"));
});

// Корневая страница с ссылками
app.get("/", (req, res) => {
  res.send(`
    <h1>Employees REST API</h1>
    <ul>
      <li><a href="/employees">GET /employees</a> – список сотрудников</li>
      <li><a href="/api-docs">Swagger UI</a></li>
      <li><a href="/redoc">ReDoc</a></li>
    </ul>
  `);
});

// Запуск
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
  console.log(`Swagger UI:      http://localhost:${PORT}/api-docs`);
  console.log(`ReDoc:           http://localhost:${PORT}/redoc`);
});
