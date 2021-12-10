import * as dotenv from "dotenv";
import express from "express";
import path from "path";
import { router } from "./router";

dotenv.config();

if (!process.env.PORT) {
    console.log("No Port Specified");
    process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.render("index.html");
});

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});