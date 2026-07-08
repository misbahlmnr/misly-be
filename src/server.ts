import "dotenv/config";
import app from "./app.js";

const port = Number(process.env.APP_PORT || 3000);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
