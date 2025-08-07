import bcrypt from "bcrypt";
import { handleCreate } from "../utils/crudHelpers/Create.js";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'
import Admin from "../models/admin.js";
import {handleDelete} from "../utils/crudHelpers/Delete.js";
dotenv.config()


export const createAdmin = async (req, res) => {
  const { password } = req.body;
  const enteredPassword = password;
  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(enteredPassword, salt);
    const creatableData = { ...req.body, password: encryptedPassword };
    const storedAdmin = await handleCreate(
      Admin,
      { email: req.body.email },
      creatableData
    );
    // const { password, ...adminDetails } = storedAdmin._doc;
    return res.status(201).json({ message: "admin created successfully"});
  } catch (error) {
    if (error.message === "matched") {
      return res.status(409).json({ message: "admin already exists" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};





export const resetAdminPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(newPassword, salt);

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { password: encryptedPassword },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to reset password" });
  }
};





export const login = async (req, res) => {
  const { email, password } = req.body;
  const newPassword = password;
  try {
    const AdminData = await Admin.findOne({ email: email }).select('+password');;
    if (!AdminData) return res.status(403).send({ message: "No admin exist" });

    const comparePassword = await bcrypt.compare(
        newPassword,
        AdminData.password
    );
    if (!comparePassword)
      return res.status(401).send({ message: "invalid credentials" });
    const token = jwt.sign(
        { email: AdminData.email, id: AdminData.id,role: AdminData.role  },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
    const { password, ...adminDetails } = AdminData._doc;
    return res.status(200).json({ admin: adminDetails, token: token });
  } catch (error) {

    return res.status(509).send({ message: "something went wrong" });
  }
};

export const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    await handleDelete(Admin, { _id: id });
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(501).json({ message: "Error in deleting admin" });
  }
};



export const getAllAdmins = async (req, res) => {
  try {
    const storedAdmin = await Admin.find();
    if (!storedAdmin.length) {
      return res
        .status(404)
        .json({ message: "No admin exist in database" });
    }
    return res.status(200).json({ admins: storedAdmin });
  } catch (error) {
    if (error.message === "Not Found") {
      return res
          .status(404)
          .json({ message: "No admin found" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};