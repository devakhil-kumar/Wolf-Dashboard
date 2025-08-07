export const handleCreate = async (Model, find, creatableData) => {
  if (find) {
    const existingData = await Model.findOne(find);
    if (existingData) {
      throw new Error('matched'); 
    }
  
  }
  const newData = new Model(creatableData);
  const savedData = await newData.save();
  return savedData;
};