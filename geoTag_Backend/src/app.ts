import express from 'express';
import authRouter from "./modules/auth/auth.route.js";


const app = express();



app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));
app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
    res.send("Welcome to the GeoTag Backend API!");
});

export default app;
