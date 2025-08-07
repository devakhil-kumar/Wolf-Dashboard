export const handleDelete = async (  Model, find) => {
  try {
    await Model.deleteOne(find);

    return {message:"successful"}
  } catch (error) {
    throw error;
  }
};