export const handleUpdate = async ( Model, find, updatableData) => {
  try {
    const existedData = await Model.findOne(find);
      if (!existedData) {
        throw new Error('Not found'); 
      }
    const updatedData = await Model.findOneAndUpdate(
      find,
      { $set: updatableData },
      { new: true }
    );

    return updatedData;
  } catch (error) {
    throw error;
  }
};
