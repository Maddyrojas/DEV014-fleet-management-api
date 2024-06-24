import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    //console.log('Authorization Header:', authHeader);
  if (authHeader) {
    const token = authHeader.split(' ')[1];// Bearer
    jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
      if (err) {
        console.error(err);
        return res.status(401).json({ error: 'Missing or Invalid or Expired Token' });
      }
      //console.log('Decoded Token:', decoded);
      //req.body.emailFrom = decoded.email;
      next();
    });
  } else {
    res.status(401).json({ error: 'Missing or Invalid or Expired Token' });
  }
};