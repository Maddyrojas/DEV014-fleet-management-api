import { Handler } from "express";
import { getAllUsers, createUsers, modifyUsers, deleteUsers, existingUser } from "../services/userService";
const bcrypt = require('bcrypt');

export const getUsers: Handler = async (req, res) => {
    try {
      const page = +(req.query.page as string) || 1;
      const limit = +(req.query.limit as string) || 10;
      const startIndex = (page - 1) * limit;
      const email = req.query.email as string;
      if (page<0 || limit<0) {
        return res.status(400).json({ message: "The page number and limit cannot be less than 0" });
      }
      const users = await getAllUsers(startIndex, limit, email);
      console.log(users);
      if (users.length===0) {
        return res.status(404).json({ message: "No users found, please change the email" });
      } else {
        return res.status(200).json(users);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'error al obtener los usuarios' })
    }
}

export const createUser: Handler = async (req, res) => {
  try {
      const { name,lastname,email,username,password,role} = req.body;
      if (!name || !lastname || !email || !username || !password || !role) {
      return res.status(400).json({ message: "The name,lastName,email,userName,password,role data are required" });
      }
      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailFormat.test(email)) {
        return res.status(400).json({ message: "The email dont have correct format" });
      }
      const existingU = await existingUser(1002, email);
      console.log(email, existingU);
      if (existingU) {
        return res.status(409).json({ message: "The user already exists" });
      }
      const salt = bcrypt.genSaltSync(10);
      const encriptPassword = bcrypt.hashSync(password, salt);
      const users = await createUsers(name,lastname,email,username,encriptPassword,role);
      return res.status(200).json(users);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'error al crear los usuarios' })
  }
}
export const modifyUser: Handler = async (req, res) => {
    try {
      const id: number = +(req.params.uid);
      const { name,lastname,role } = req.body;
      if (!id || id <= 0 || isNaN(id)) {
        return res.status(400).json({ message: "Error when typing the ID, please correct the ID" });
      }
      if (!name || !lastname || !role) {
        return res.status(400).json({ message: "The name,lastName,and role data are required" });
      }
      const existingU = await existingUser(id);
      if (!existingU) {
        return res.status(404).json({ message: "The user does not exist" });
      }
      const users = await modifyUsers(id,name,lastname,role);
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'error al modificar los usuarios' })
    }
}
export const deleteUser: Handler = async (req, res) => {
    try {
      const id = +(req.params.uid);
      const {email} = req.body;
      if (!id || id <= 0 || isNaN(id)) {
        return res.status(400).json({ message: "Error when typing the ID, please correct the ID" });
      }
      const existingU = await existingUser(id);
      if (!existingU) {
        return res.status(404).json({ message: "The user does not exist" });
      }
      const users = await deleteUsers(id,email);
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'error al eliminar los usuarios' })
    }
}