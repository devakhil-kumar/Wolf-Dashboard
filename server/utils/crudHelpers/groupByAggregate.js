export const handleGroupByAggregate = async (Model, pipeline, groupId, aggregationOperations) => {
  try {
    const data = await Model.aggregate(pipeline);
    if (!data) throw new Error("Not Found");

    const [totalDocumentsResult] = await Model.aggregate([{ $group: { _id: groupId, ...aggregationOperations } }, { $count: "totalDocuments" }]);
    const totalDocuments = totalDocumentsResult ? totalDocumentsResult.totalDocuments : 0;

    return {
      customers: data,
      paginationInfo: {
        totalDocuments,
        totalPages: Math.ceil(totalDocuments / pipeline[pipeline.length - 1].$limit),
        currentPage: pipeline[pipeline.length - 2].$skip / pipeline[pipeline.length - 1].$limit + 1,
        pageSize: pipeline[pipeline.length - 1].$limit
      }
    };
  } catch (error) {
    throw error;
  }
};
