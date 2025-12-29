import Staff from "../models/staff.js";
import { changeFormatDateForFetchingData } from "../utils/index.js";
import { aggregateSalesDataByStaff } from "../utils/modifyApiData.js";

// Sync staff from external API and save to database - ALL LOCATIONS
export const syncStaffFromExternal = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "startDate and endDate are required" });
  }

  try {
    const headers = {
      'Content-Type': 'application/json',
      'token': '5AF49267-8C88-4C2C-8D69-7AB9B493F340'
    };

    const startdate = changeFormatDateForFetchingData(startDate);
    const enddate = changeFormatDateForFetchingData(endDate);

    const datares = await fetch(`https://tcpsvr121.clickpos.net/ctime/ctimeapi/Sales/SaleDatafusion?startdate=${startdate}&enddate=${enddate}`, { headers });

    if (!datares.ok) {
      throw new Error('Failed to fetch data from external API');
    }

    const alldata = await datares.json();

    if (!Array.isArray(alldata)) {
      throw new Error('Expected an array but received a different structure');
    }

    console.log(`Syncing staff from ${alldata.length} locations`);

    let totalAdded = 0;
    let totalExisting = 0;
    const locationSummary = [];

    // Loop through all stores/locations
    for (const store of alldata) {
      if (!store.StoreName || !store.SalesDataaggregation) {
        continue;
      }

      const storeName = store.StoreName;
      console.log(`Processing ${storeName}...`);

      // Aggregate data for this specific store
      const aggregatedData = await aggregateSalesDataByStaff(alldata, storeName);

      // Filter out entries without salesrep
      const filteredData = aggregatedData.filter(item => item.salesrep && item.salesrep.trim() !== "");

      // Extract unique salesrep names for this location
      const uniqueSalesReps = [...new Set(filteredData.map(item => item.salesrep.trim()))];

      let addedCount = 0;
      let existingCount = 0;

      // Save to database with correct location
      for (const salesrep of uniqueSalesReps) {
        try {
          await Staff.create({
            salesrep: salesrep,
            salelocation: storeName.toUpperCase(),
            isActive: true
          });
          addedCount++;
          totalAdded++;
        } catch (error) {
          if (error.code === 11000) {
            // Duplicate entry - staff already exists for this location
            existingCount++;
            totalExisting++;
          } else {
            throw error;
          }
        }
      }

      locationSummary.push({
        location: storeName,
        added: addedCount,
        existing: existingCount,
        total: uniqueSalesReps.length
      });

      console.log(`${storeName}: Added ${addedCount}, Existing ${existingCount}`);
    }

    return res.status(200).json({
      message: `Sync completed for all locations. Total Added: ${totalAdded}, Total Existing: ${totalExisting}`,
      totalAdded,
      totalExisting,
      locationSummary
    });

  } catch (error) {
    console.error('Error syncing staff:', error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all staff by location
export const getStaffByLocation = async (req, res) => {
  const { salelocation } = req.query;

  if (!salelocation) {
    return res.status(400).json({ message: "salelocation is required" });
  }

  try {
    const staff = await Staff.find({
      salelocation: { $regex: new RegExp(salelocation, "i") },
      isActive: true
    }).sort({ salesrep: 1 });

    return res.status(200).json({
      staff: staff,
      count: staff.length
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all staff (all locations)
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find({ isActive: true }).sort({ salelocation: 1, salesrep: 1 });

    return res.status(200).json({
      staff: staff,
      count: staff.length
    });
  } catch (error) {
    console.error('Error fetching all staff:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Manually add staff
export const addStaff = async (req, res) => {
  const { salesrep, salelocation } = req.body;

  if (!salesrep || !salelocation) {
    return res.status(400).json({ message: "salesrep and salelocation are required" });
  }

  try {
    const newStaff = await Staff.create({
      salesrep: salesrep.trim(),
      salelocation: salelocation.toUpperCase(),
      isActive: true
    });

    return res.status(201).json({
      message: "Staff added successfully",
      staff: newStaff
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Staff already exists for this location"
      });
    }
    console.error('Error adding staff:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update staff (activate/deactivate)
export const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { isActive, salesrep, salelocation } = req.body;

  try {
    const updateData = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (salesrep) updateData.salesrep = salesrep.trim();
    if (salelocation) updateData.salelocation = salelocation.toUpperCase();

    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res.status(200).json({
      message: "Staff updated successfully",
      staff: updatedStaff
    });
  } catch (error) {
    console.error('Error updating staff:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete staff
export const deleteStaff = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStaff = await Staff.findByIdAndDelete(id);

    if (!deletedStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res.status(200).json({
      message: "Staff deleted successfully",
      staff: deletedStaff
    });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
