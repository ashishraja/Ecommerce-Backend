import express  from "express";
import { ErrorMiddleware } from "./Middleware/error.js";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"

config({
  path:"./Config/config.env",
});
  
const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended:true,
}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));

import order from "./Routes/orderRoute.js"
import user from "./Routes/userRoute.js"
import payment from "./Routes/paymentRoute.js"
import product from "./Routes/productRoute.js"
app.use("/api/v1",product); 
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",payment);


app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID })
);
  
app.use(ErrorMiddleware);

export default app;