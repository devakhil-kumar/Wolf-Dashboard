
import Commission from "../models/commission.js";


export const createCommission = async (req, res) => {
    const { salesrep, salelocation, createdDate, ownerCommission, updatedBy } = req.body;
  
    try {
      // Check if a commission record already exists
      const existingCommission = await Commission.findOne({
        salesrep: { $regex: new RegExp(salesrep, "i") },
        salelocation: { $regex: new RegExp(salelocation, "i") },
        createdDate: { $eq: new Date(createdDate) },
      });
  
      if (existingCommission) {
        // If a commission record exists, respond with a conflict status
        return res.status(409).json({
          message: "Commission data already exists for the given criteria.",
        });
      } else {
        // Create a new commission entry
        const commission = new Commission({
          salesrep,
          salelocation,
          createdDate,
          ownerCommission,
          updatedBy,
        });
        await commission.save();
  
        return res.status(201).json({
          commission,
          message: `Commission data created for ${salelocation}`,
        });
      }
    } catch (error) {
      console.error('Error creating commission:', error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };


  // Update an existing commission entry
// export const updateCommission = async (req, res) => {
//     const value = req.body[req.body.fieldsToBeUpdate];
//     const newData = {};
//     newData[req.body.fieldsToBeUpdate] = value;
//     console.log(req)
  
//     try {
//       const storedCommission = await Commission.findOneAndUpdate(
//         {
//           salesrep: { $regex: new RegExp(req.body.salesrep, "i") },
//           salelocation: { $regex: new RegExp(req.body.salelocation, "i") },
//           createdDate: { $eq: new Date(req.body.createdDate) },
//         },
//         { $set: newData },
//         { new: true }
//       );
  
//       return res.status(200).json({ commission: storedCommission });
//     } catch (error) {
//       return res.status(501).json({ message: "Something went wrong" });
//     }
//   };
export const updateCommission = async (req, res) => {
    const { salesrep, salelocation, createdDate, ownerCommission, updatedBy } = req.body.commissionData;
  
    try {
      // Parse the string to a Date object
      const parsedDate = new Date(createdDate);
  console.log(req.body)
      // Ensure the parsedDate is valid
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
  
      const storedCommission = await Commission.findOneAndUpdate(
        {
          salesrep: { $regex: new RegExp(salesrep, "i") },
          salelocation: { $regex: new RegExp(salelocation, "i") },
          createdDate: parsedDate, // Use the parsed Date object
        },
        { $set: { ownerCommission, updatedBy } },
        { new: true }
      );
  
      if (!storedCommission) {
        return res.status(404).json({ message: "Commission not found" });
      }
  
      return res.status(200).json({ commission: storedCommission });
    } catch (error) {
      console.error("Error in updateCommission:", error);
      return res.status(501).json({ message: "Something went wrong" });
    }
  };


  export const getCommission = async (req, res) => {
    const { startDate, endDate } = req.query;
  
    // Helper function to parse date strings in dd/MM/yyyy or dd/MM/yy format
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.trim().split("/");
      const fullYear = year.length === 2 ? `20${year}` : year; // Convert two-digit year to four-digit year if necessary
      return new Date(`${fullYear}-${month}-${day}`);
    };
  
    try {
      const query = {
        createdDate: {
          $gte: parseDate(startDate),
          $lte: parseDate(endDate),
        },
      };
  
      const storedCommission = await Commission.find(query);
  
      return res.status(200).json({ commission: storedCommission });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };