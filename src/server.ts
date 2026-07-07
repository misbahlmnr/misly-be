import express from "express";

const app = express();
const port = Number(process.env.APP_PORT || 3000);

app.use(express.json());

app.get("/", (_, res) => {
  res.json({ message: "API running" });
});

app.get("/health", (_, res) => {
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
