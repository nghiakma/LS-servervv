require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import cartRouter from "./routes/cart.route";
import layoutRouter from "./routes/layout.route";
import notificationRouter from "./routes/notification.route";
import orderRouter from "./routes/order.route";
import analyticsRouter from "./routes/analytics.route";

app.use(express.json({ limit: "50mb" }));


app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:3000', 
  credentials: true, 
};

app.use(cors(corsOptions));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  });

app.use("/api/v1",
    userRouter,
    courseRouter,
    layoutRouter,
    cartRouter,
    notificationRouter,
    orderRouter,
    analyticsRouter
)


app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      succcess: true,
      message: "API đang làm việc",
    });
  });
  

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Đường dẫn ${req.originalUrl} không tìm thấy`) as any;
    err.statusCode = 404;
    next(err);
  });

app.use(limiter);
