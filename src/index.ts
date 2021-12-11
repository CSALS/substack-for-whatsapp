import * as dotenv from "dotenv";
import express from "express";
import path from "path";
import { router } from "./router";

dotenv.config();

if (!process.env.PORT) {
    console.log("No Port Specified");
    process.exit(1);
}

if (!process.env.TWILIO_BOT_NUMBER) {
    console.log("Twilio bot number is not configured for the environment")
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home.ejs", {
        twilioBotNumber: process.env.TWILIO_BOT_NUMBER,
        registerMessage: "Register%20me"
    });
});

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});