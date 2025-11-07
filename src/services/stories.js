import { SORT_ORDER } from '../constants/index.js';
import { StoriesCollection } from '../db/models/story.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllStories = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const storiesQuery = StoriesCollection.find({ userId });

  if (filter.category) {
    storiesQuery.where('category').equals(filter.category);
  }

  const [storiesCount, stories] = await Promise.all([
    StoriesCollection.find().merge(storiesQuery).countDocuments(),
    storiesQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(storiesCount, perPage, page);

  return {
    data: stories,
    ...paginationData,
  };
};
