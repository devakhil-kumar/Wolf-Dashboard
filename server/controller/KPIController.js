import { handleCreate } from "../utils/crudHelpers/Create.js";
import { handleUpdate } from "../utils/crudHelpers/Update.js";
import { handleDelete } from "../utils/crudHelpers/Delete.js";
import KPI from "../models/KpiTarget.js";

export const createKPI = async (req, res) => {
  const creatableData = { ...req.body };

  try {
    const storedKPI = await handleCreate(
      KPI,
      {
        salelocation: { $regex: new RegExp(req.body.salelocation , "i") },
        createdDate: { $eq: new Date(req.body.createdDate) },
      },
      creatableData
    );
    return res.status(201).json({
      kpi: storedKPI,
      message: `KPI target created for ${req.body.salelocation}`,
    });
  } catch (error) {
    if (error.message === "matched") {
      return res.status(409).json({
        message: "KPI target already exists, may be with same store name",
      });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const updateKPI = async (req, res) => {
  const { id } = req.params;
  try {
    const updatableData = { ...req.body };
    const storedKPI = await handleUpdate(KPI, { _id: id }, updatableData);

    return res.status(200).json({ KPI: storedKPI });
  } catch (error) {
    return res.status(501).json({ message: "Something went wrong" });
  }
};

export const updateAllKPI = async (req, res) => {
  try {
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.trim().split("/");
      const fullYear = year.length === 2 ? `20${year}` : year;
      return new Date(`${fullYear}-${month}-${day}`);
    };
    const updatableData = { ...req.body };
    const kpis = await KPI.updateMany(
      { createdDate: { $eq: parseDate(req.body.createdDate) } },
      { $set: updatableData }
    );

    return res
      .status(200)
      .send({ message: "All KPI documents updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: "Something went wrong" });
  }
};

export const deleteKPI = async (req, res) => {
  const { id } = req.params;
  try {
    await handleDelete(KPI, { _id: id });
    return res.status(200).json({ message: "KPI target deleted successfully" });
  } catch (error) {
    return res.status(501).json({ message: "Something went wrong" });
  }
};

export const getKPI = async (req, res) => {
  const { salelocation, startDate, endDate } = req.query;
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.trim().split("/");
    const fullYear = year.length === 2 ? `20${year}` : year;
    return new Date(`${fullYear}-${month}-${day}`);
  };
  try {
    const storedKPI = await KPI.findOne({
      salelocation: { $regex: new RegExp(salelocation, "i") },
      createdDate: {
        $gte: parseDate(startDate),
        $lte: parseDate(endDate),
      },
    });
    console.log("result:",storedKPI)
    console.log("storedKPI:", storedKPI, typeof storedKPI);
    if (!storedKPI && storedKPI !== null) {
      console.log("here404:")
      return res.status(404).json({ message: "No KPI target found for this store." });
    }

    return res.status(200).json({ kpi: storedKPI });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getKPIs = async (req, res) => {
  const { startDate, endDate } = req.query;

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.trim().split("/");
    const fullYear = year.length === 2 ? `20${year}` : year;
    return new Date(`${fullYear}-${month}-${day}`);
  };
  try {
    let query = {};
    if (startDate && endDate) {
      query.createdDate = {
        $gte: parseDate(startDate),
        $lte: parseDate(endDate),
      };
    }
    const storedKPIs = await KPI.find(query);

    // if (storedKPIs.length === 0) {
    //   return res.status(404).json({ message: "No KPI targets found." });
    // }

    return res.status(200).json({ kpis: storedKPIs });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};