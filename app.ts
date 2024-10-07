require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import { rateLimit } from "express-rate-limit";
import cartRouter from "./routes/cart.route";

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());
const corsOptions = {
  origin: 'http://localhost:3000', 
  credentials: true, 
};
// cors => cross origin resource sharing
app.use(cors(corsOptions));

// api requests limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// routes
app.use(
  "/api/v1",
  userRouter,
  orderRouter,
  courseRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter,
  cartRouter
);

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    succcess: true,
    message: "API đang làm việc",
  });
});

// đường dẫn ko tồn tại
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Đường dẫn ${req.originalUrl} không tìm thấy`) as any;
  err.statusCode = 404;
  next(err);
});

//gọi middleware 
app.use(limiter);
app.use(ErrorMiddleware);

// require("dotenv").config();
// import express, { NextFunction, Request, Response } from "express";
// export const app = express();
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import { rateLimit } from "express-rate-limit";
// import { ErrorMiddleware } from "./middleware/error";
// import userRouter from "./routes/user.route";
// import courseRouter from "./routes/course.route";
// import orderRouter from "./routes/order.route";
// import notificationRouter from "./routes/notification.route";
// import analyticsRouter from "./routes/analytics.route";
// import layoutRouter from "./routes/layout.route";
// //body parser
// //kích thước tối đa dữ liệu mà server có thể nhận được
// app.use(express.json({limit: "50mb"}))

// //cookie parser
// app.use(cookieParser());

// //cors
// // app.use(cors(
// //    {
// //     origin: process.env.ORIGIN
// //    }
// // ));
// app.use(cors());

// // giới hạn só lượng request
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     standardHeaders: "draft-7",
//     legacyHeaders: false,
//   });

// //routes
// app.use(
//   "/api/v1",
//   userRouter,
//   orderRouter,
//   courseRouter,
//   notificationRouter,
//   analyticsRouter,
//   layoutRouter
// );
// //kiểm tra api
// app.get("/test", (req: Request, res: Response, next: NextFunction) => {
//     res.status(200).json({
//       succcess: true,
//       message: "API đang làm việc",
//     });
//   });

// // đường dẫn không tìm thấy
// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//     const err = new Error(`Đường dẫn ${req.originalUrl} không tìm thấy`) as any;
//     err.statusCode = 404;
//     next(err);
//   });

// // middleware calls
// app.use(limiter);
// app.use(ErrorMiddleware);