import { UsersCollection } from '../db/models/user.js';
import { StoriesCollection } from '../db/models/story.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getUserCurrentService = async (userId) => {
  return await UsersCollection.findOne({ _id: userId })
    .select('-password')
    .populate('favorites'); 
};

export const getUserByIdService = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'favoriteCount',
  sortOrder = SORT_ORDER.DESC,
}) => {
  const skip = (page - 1) * perPage;

  const user = await UsersCollection.findById(userId)
    .select('name avatarUrl description createdAt')
    .lean();

  const filter = { ownerId: userId };

  const articlesQuery = StoriesCollection.find(filter)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(perPage)
    .lean();

  const [articles, total] = await Promise.all([
    articlesQuery,
    StoriesCollection.countDocuments(filter),
  ]);

  const paginationData = calculatePaginationData(total, perPage, page);

  return {
    data: { user, articles },
    ...paginationData
  };
};