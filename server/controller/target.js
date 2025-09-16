import { handleCreate } from "../utils/crudHelpers/Create.js";
import { handleUpdate } from "../utils/crudHelpers/Update.js";
import { handleDelete } from "../utils/crudHelpers/Delete.js";
import Target from "../models/target.js";

export const createTarget = async (req, res) => {
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
    const storedTarget = await handleCreate(
      Target,
      {
        salelocation: { $regex: new RegExp(req.body.salelocation, "i") },
        createdDate: { $eq: new Date(req.body.createdDate) },
      },
      creatableData
    );
    return res.status(201).json({
      target: storedTarget,
      message: `store target created for ${req.body.salelocation}`,
    });
  } catch (error) {
    if (error.message === "matched") {
      return res.status(409).json({
        message: "Target already exists, may be with same store name",
      });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const updateTarget = async (req, res) => {
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

    const storedTarget = await handleUpdate(Target, { _id: id }, updatableData);

    return res.status(200).json({ Target: storedTarget });
  } catch (error) {
    return res.status(501).json({ message: "something went wrong" });
  }
};
export const updateAllTarget = async (req, res) => {
  try {
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.trim().split("/");
      const fullYear = year.length === 2 ? `20${year}` : year; // Convert two-digit year to four-digit year if necessary
      return new Date(`${fullYear}-${month}-${day}`);
    };

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

    const targets = await Target.updateMany(
      { createdDate: { $eq: parseDate(req.body.createdDate) } },
      { $set: updatableData }
    );

    return res
      .status(200)
      .send({
        message: "All documents updated successfully",
        modifiedCount: targets.modifiedCount
      });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: "something went wrong" });
  }
};

export const deleteTarget = async (req, res) => {
  const { id } = req.params;
  try {
    await handleDelete(Target, { _id: id });
  } catch (error) {
    return res.status(501).json({ message: "something went wrong" });
  }
};

export const getTarget = async (req, res) => {
  const {salelocation, startDate, endDate } = req.query;
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.trim().split("/");
    const fullYear = year.length === 2 ? `20${year}` : year; // Convert two-digit year to four-digit year if necessary
    return new Date(`${fullYear}-${month}-${day}`);
  };
  try {
    const storedtarget = await Target.findOne({
      salelocation: { $regex: new RegExp(salelocation, "i") },
      createdDate: {
        $gte: parseDate(startDate),
        $lte: parseDate(endDate),
      },
    });

    return res.status(200).json({ target: storedtarget });
  } catch (error) {
    if (error.message === "Not Found") {
      return res
        .status(404)
        .json({ message: "No target found for this store." });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const getTargets = async (req, res) => {
  const { startDate, endDate } = req.query;

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.trim().split("/");
    const fullYear = year.length === 2 ? `20${year}` : year; // Convert two-digit year to four-digit year if necessary
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
    const storedtarget = await Target.find(query);

    return res.status(200).json({ targets: storedtarget });
  } catch (error) {
    if (error.message === "Not Found") {
      return res
        .status(404)
        .json({ message: "No target found for this user." });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

// Helper function to get available products for bonus selection
export const getAvailableProducts = async (req, res) => {
  try {
    const availableProducts = [
      'PPN',
      'SB PPN',
      'Bundle New',
      'TMB',
      'Device Protection',
      'Belong PPN',
      'SB NBN',
      'Belong NBN',
      'Telstra Plus',
      'Device Security($10/m)',
      'Outright Mobile/Tablet Inc Prepaid',
      'DPC Mobile/Tablet',
      'Smart Watch',
      'Accessory GP'
    ];

    return res.status(200).json({ products: availableProducts });
  } catch (error) {
    console.error('Error fetching available products:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
