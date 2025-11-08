import { UsersCollection } from '../db/models/user.js';
import { StoriesCollection } from '../db/models/story.js';

export const getUsers = async (page, perPage, sortBy, sortOrder) => {
  const skip = (page - 1) * perPage;

  const [users, total] = await Promise.all([
    UsersCollection.find()
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(perPage),
    UsersCollection.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    users,
    pageInfo: {
      total,
      page,
      perPage,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export const getUserCurrentService = async (userId) => {
  return await UsersCollection.findOne({ _id: userId })
    .select('-password')
    .populate('favorites');
};
