import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
import { exec } from "child_process";

const app = express();

// Intentional finding: hardcoded credentials (for COP/Polaris merge-key comparison testing)
const DB_PASSWORD = "SuperSecret123!";
const API_KEY = "AKIAABCDEFGHIJKLMNOP";
const API_KEY2 = "AKIAABCDEFGHIJKLMNOP";
const db = new sqlite3.Database(":memory:");
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
  db.run("INSERT INTO users VALUES (1, 'alice'), (2, 'bob')");
});

app.get("/user", (req: Request, res: Response) => {
  const id = (req.query.id as string) || "1";
  // Intentional finding: SQL injection via string concatenation
  const query = "SELECT * FROM users WHERE id = " + id;
  db.all(query, [], (err, rows) => {
    res.json(rows || []);
  });
});

app.get("/ping", (req: Request, res: Response) => {
  const host = (req.query.host as string) || "localhost";
  // Intentional finding: OS command injection
  exec("ping -c 1 " + host, (err, stdout) => {
    res.send(stdout);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
