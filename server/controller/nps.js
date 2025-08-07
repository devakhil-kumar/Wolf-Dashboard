import { handleCreate } from "../utils/crudHelpers/Create.js";
import { handleUpdate } from "../utils/crudHelpers/Update.js";
import { handleDelete } from "../utils/crudHelpers/Delete.js";
import NPS from "../models/nps.js";

export const createNPS = async (req, res) => {
  const creatableData = { ...req.body };

  try {
    const storedNPS = await handleCreate(
      NPS,
      {
        salesrep: { $regex: new RegExp(req.body.salesrep, "i") },
        salelocation: { $regex: new RegExp(req.body.salelocation, "i") },
        createdDate: { $eq: new Date(req.body.createdDate) },
      },
      creatableData
    );
    return res.status(201).json({
      NPS: storedNPS,
      message: `new NPS created for ${req.body.salelocation}`,
    });
  } catch (error) {
    if (error.message === "matched") {
      return res
        .status(409)
        .json({ message: "NPS already exists, may be with same store name" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const updateNPS = async (req, res) => {
  const value = req.body[req.body.fieldsToBeUpdate];
  // console.log(value )
  const newData = {};
  newData[req.body.fieldsToBeUpdate] = value;
  // console.log(newData)

  try {
    const storedNPS = await NPS.findOneAndUpdate(
      {
        salesrep: { $regex: new RegExp(req.body.salesrep, "i") },
        salelocation: { $regex: new RegExp(req.body.salelocation, "i") },
        createdDate: { $eq: new Date(req.body.createdDate) },
      },
      { $set: newData },
      { new: true }
    );
// console.log(storedNPS)
    return res.status(200).json({ NPS: storedNPS });
  } catch (error) {
    // console.log(error)
    return res.status(501).json({ message: "something went wrong" });
  }
};

export const deleteNPS = async (req, res) => {
  const { id } = req.params;
  try {
    await handleDelete(NPS, { _id: id });
  } catch (error) {
    return res.status(501).json({ message: "something went wrong" });
  }
};

export const getNPS = async (req, res) => {
  const { salesrep, storeLocation, startDate, endDate } = req.query;
  try {
    const query = {
      salesrep: { $regex: new RegExp(salesrep, "i") },
      salelocation: { $regex: new RegExp(storeLocation, "i") },
      createdDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };
    const storedNPS = await NPS.findOne(query);

    return res.status(200).json({ NPS: storedNPS });
  } catch (error) {
    if (error.message === "Not Found") {
      return res.status(404).json({ message: "No NPS found for this store." });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const getAllNPS = async (req, res) => {
  const { startDate, endDate } = req.query;

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.trim().split("/");
    const fullYear = year.length === 2 ? `20${year}` : year; // Convert two-digit year to four-digit year if necessary
    return new Date(`${fullYear}-${month}-${day}`);
  };

  let dateFilter = {};

  if (startDate && endDate) {
    dateFilter = {
      createdDate: {
        $gte: parseDate(startDate),
        $lte: parseDate(endDate),
      },
    };
  } else {
    return res
      .status(404)
      .json({ message: "start date and end date are required" });
  }

  try {
    const storedNPS = await NPS.aggregate([
      { $match: dateFilter },
      {
        $sort: { createdDate: -1 }, // Sort by createdDate in descending order
      },
      {
        $group: {
          _id: {
            salesrep: "$salesrep",
            salelocation: "$salelocation",
          },
          totalAdv10_9: { $sum: "$adv10_9" },
          totalPass8_7: { $sum: "$pass8_7" },
          totalDetrLess6: { $sum: "$detr_less_6" },
          createdDate: { $max: "$createdDate" },
          createdAt: { $max: "$createdAt" },
          updatedAt: { $max: "$updatedAt" },
          mostRecentId: { $max: "$_id" },
        },
      },
      {
        $project: {
          _id: 0,
          salesrep: "$_id.salesrep",
          salelocation: "$_id.salelocation",
          adv10_9: "$totalAdv10_9",
          pass8_7: "$totalPass8_7",
          detr_less_6: "$totalDetrLess6",
          createdDate: "$createdDate",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
          mostRecentId: "$mostRecentId",
        },
      },
      { $sort: { salesrep: 1, salelocation: 1 } }, // Optional: Sort by salesrep and salelocation
    ]);
    res.status(200).json(storedNPS);
  } catch (error) {
    console.log(error);
    if (error.message === "Not Found") {
      return res.status(404).json({ message: "No NPS found for this user." });
    } else {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
};
