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
import quizzRouter from "./routes/quizz.route";
import path from "path";
import ejs from "ejs";
import {
  sendMail
} from "./utils/sendMail";
import ErrorHandler from "./utils/ErrorHandler";
import puppeteer, { Browser } from "puppeteer";
// body parser
app.use(express.json({ limit: "100mb" }));

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
  cartRouter,
  quizzRouter
);
// app.set('view engine', 'ejs');
// app.set('views', './mails');
// testing api
app.get("/test", async (req: Request, res: Response, next: NextFunction) => {
  let browser: Browser | null = null;
  try {
    browser = await puppeteer.launch({ headless: true }); // Đặt headless là true nếu không cần thấy trình duyệt
    const [page] = await browser.pages();
    const html = await ejs.renderFile("./mails/send-certification.ejs", {
      course: 'ava',
      name: 'adsasd',
      date: new Date().toLocaleDateString('en-us')
    });
    await page.setContent(html);

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px"
      }
    });

    console.log("PDF generated successfully:", pdf.length > 0); // Kiểm tra kích thước PDF
    res.contentType("application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=send-certification.pdf");
    res.end(pdf);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
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