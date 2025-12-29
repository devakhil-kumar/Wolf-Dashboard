import { handleCreate } from "../utils/crudHelpers/Create.js";
import { handleUpdate } from "../utils/crudHelpers/Update.js";
import { handleDelete } from "../utils/crudHelpers/Delete.js";
import ProrataStaff from "../models/prorataStaff.js";

export const createProrataStaff = async (req, res) => {
  const creatableData = { ...req.body };

  // Validate productBonuses if provided
  if (creatableData.productBonuses && Array.isArray(creatableData.productBonuses)) {
    for (const bonus of creatableData.productBonuses) {
      if (!bonus.product || typeof bonus.product !== 'string') {
        return res.status(400).json({
          message: "Each product bonus must have a valid product name",
        });
      }
      if (!bonus.bonusValue || typeof bonus.bonusValue !== 'number' || bonus.bonusValue <= 0) {
        return res.status(400).json({
          message: "Each product bonus must have a valid bonus value greater than 0",
        });
      }
    }
  }

  try {
    const storedProrataStaff = await handleCreate(
      ProrataStaff,
      {
        salesrep: req.body.salesrep,
        salelocation: { $regex: new RegExp(req.body.salelocation, "i") },
        createdDate: { $eq: new Date(req.body.createdDate) },
      },
      creatableData
    );
    return res.status(201).json({
      prorataStaff: storedProrataStaff,
      message: `Pro-rata staff ${req.body.salesrep} created successfully`,
    });
  } catch (error) {
    if (error.message === "matched") {
      return res.status(409).json({
        message: "Pro-rata staff already exists for this date and location",
      });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const updateProrataStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const updatableData = { ...req.body };

    // Validate productBonuses if provided
    if (updatableData.productBonuses && Array.isArray(updatableData.productBonuses)) {
      for (const bonus of updatableData.productBonuses) {
        if (!bonus.product || typeof bonus.product !== 'string') {
          return res.status(400).json({
            message: "Each product bonus must have a valid product name",
          });
        }
        if (!bonus.bonusValue || typeof bonus.bonusValue !== 'number' || bonus.bonusValue <= 0) {
          return res.status(400).json({
            message: "Each product bonus must have a valid bonus value greater than 0",
          });
        }
      }
    }

    const storedProrataStaff = await handleUpdate(ProrataStaff, { _id: id }, updatableData);

    return res.status(200).json({ prorataStaff: storedProrataStaff });
  } catch (error) {
    return res.status(501).json({ message: "something went wrong" });
  }
};

export const deleteProrataStaff = async (req, res) => {
  const { id } = req.params;
  try {
    await handleDelete(ProrataStaff, { _id: id });
    return res.status(200).json({ message: "Pro-rata staff deleted successfully" });
  } catch (error) {
    return res.status(501).json({ message: "something went wrong" });
  }
};

export const getProrataStaff = async (req, res) => {
  const { salelocation, startDate, endDate } = req.query;

  const parseDate = (dateStr, endOfDay = false) => {
    const [day, month, year] = dateStr.trim().split("/");
    const fullYear = year.length === 2 ? `20${year}` : year;
    const d = new Date(Date.UTC(+fullYear, +month - 1, +day));
    if (endOfDay) {
      d.setUTCHours(23, 59, 59, 999);
    } else {
      d.setUTCHours(0, 0, 0, 0);
    }
    return d;
  };

  try {
    const end = parseDate(endDate, true);

    const prorataStaffList = await ProrataStaff.find({
      salelocation: { $regex: new RegExp(salelocation, "i") },
      createdDate: { $lte: end },
    }).sort({ createdDate: -1 });

    return res.status(200).json({ prorataStaff: prorataStaffList });
  } catch (error) {
    console.error("getProrataStaff error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllProrataStaff = async (req, res) => {
  const { startDate, endDate } = req.query;

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.trim().split("/");
    const fullYear = year.length === 2 ? `20${year}` : year;
    return new Date(`${fullYear}-${month}-${day}`);
  };

  try {
    let query;
    if (startDate && endDate) {
      query = {
        createdDate: {
          $gte: parseDate(startDate),
          $lte: parseDate(endDate),
        },
      };
    } else {
      query = {};
    }
    const prorataStaffList = await ProrataStaff.find(query);

    return res.status(200).json({ prorataStaff: prorataStaffList });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
