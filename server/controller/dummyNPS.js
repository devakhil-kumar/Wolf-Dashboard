import DummyNPS from "../models/dummyNps";
import { handleCreate } from "../utils/crudHelpers/Create";



export const createNPS = async (req, res) => {
  const creatableData = { ...req.body };

  try {
    const storedNPS = await handleCreate(
      DummyNPS,
      {
        salesrep: { $regex: new RegExp(req.body.salesrep, "i") },
        salelocation: { $regex: new RegExp(req.body.storeLocation, "i") },
        createdDate: { $eq: new Date(req.body.compareDate) },
      },
      creatableData
    );
    return res.status(201).json({
      DummyNPS: storedNPS,
      message: `new DummyNPS created for ${req.body.salelocation}`,
    });
  } catch (error) {
    if (error.message === "matched") {
      return res
        .status(409)
        .json({ message: "DummyNPS already exists, may be with same store name" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
