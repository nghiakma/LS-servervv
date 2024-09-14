import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Lỗi máy chủ nội bộ";

  // lỗi id
  if (err.name === "CastError") {
    const message = `Tài nguyên không tìm thấy. không hợp lệ: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // lỗi trùng khóa trong mongodb
  if (err.code === 11000) {
    const message = `Trùng lặp ${Object.keys(err.keyValue)} đã được nhập`;
    err = new ErrorHandler(message, 400);
  }

  // lỗi jwt
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token không hợp lệ, vui lòng thử lại`;
    err = new ErrorHandler(message, 400);
  }

  // lỗi jwt hết hạn
  if (err.name === "TokenExpiredError") {       
    const message = `Json web token hết hạn, vui lòng thử lại`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};