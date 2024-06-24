import { Handler } from "express";
import { getAllUsers } from "../services/userService";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createAuth: Handler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const users = await getAllUsers(0, 1, email);
    const user = users[0];
    if (!user) {
      return res.status(404).json({ error: "User not found, please check your credentials" });
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const SECRET_KEY = 'your_secret_key';
    const EXPIRATION_TIME = '1h';
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Información que se incluirá en el JWT
      SECRET_KEY,
      { expiresIn: EXPIRATION_TIME }
    );
    console.log(token);
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error during authentication' })
  }
}


