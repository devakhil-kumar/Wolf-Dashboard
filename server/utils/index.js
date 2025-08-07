export const buildAggregationOperations = (fields) =>
  fields.reduce((acc, field) => ({ ...acc, [field]: { $push: `$${field}` } }), {});


export const formatDate = (date) => {
  const [day, month, year] = date.split('/');
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export function changeFormatDateForFetchingData(inputDate) {
  // Split the input date by '/'
  const parts = inputDate.split('/');
  
  // Extract day, month, and year
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];
  const add20 = year.length === 2 ? "20" : ""
  // Convert to yyyy/mm/dd format
  const formattedDate = `${add20}${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
  return formattedDate;
}
