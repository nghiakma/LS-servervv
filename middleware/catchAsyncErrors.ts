import { NextFunction, Request, Response } from "express";

//hàm nhận 1 một hàm hor ... hàm và trả về một hàm mới (wrapper function)
export const CatchAsyncError = 
(theFunc: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(theFunc(req, res,next)).catch(next);
}