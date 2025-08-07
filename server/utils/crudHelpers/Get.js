export const handleGet = async (Model, find) => {
  const data = await Model.findOne(find);
  if (!data) {
    throw new Error("Not Found");
  }
  return data;
};
export const handleGetAll = async (Model, find = {}, page = 1, limit = 15) => {
  try {
    const skip = (page - 1) * limit;
    const totalDocuments = await Model.countDocuments(find);
    const totalPages = Math.ceil(totalDocuments / limit);

    const data = await Model.find(find).skip(skip).limit(limit);

    return {
      customers: data,
      paginationInfo: {
        totalDocuments,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    };
  } catch (error) {
    throw error;
  }
};
