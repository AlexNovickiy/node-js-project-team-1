import createHttpError from 'http-errors';
import { SORT_ORDER } from '../constants/index.js';
import { StoriesCollection } from '../db/models/story.js';
import { UsersCollection } from '../db/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getUsers = async (page, perPage, sortBy, sortOrder) => {
  const skip = (page - 1) * perPage;

  const [users, total] = await Promise.all([
    UsersCollection.find()
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(perPage)
      .exec(),
    UsersCollection.countDocuments().exec(),
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

export const removeArticle = async (userId, storyId) => {
  const story = await StoriesCollection.findById(storyId);
  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const index = user.favorites.findIndex(
    (id) => id.toString() === storyId.toString(),
  );
  if (index === -1) {
    throw createHttpError(404, 'Story not in favorites');
  }

  user.favorites.splice(index, 1);
  await user.save();

  await StoriesCollection.findByIdAndUpdate(storyId, {
    $inc: { favoriteCount: -1 },
  });

  const populatedUser = await UsersCollection.findById(userId).populate(
    'favorites',
  );
  return populatedUser.favorites;
};

export const getUserCurrentService = async (userId, { page, perPage }) => {
  const skip = (page - 1) * perPage;
  const user = await UsersCollection.findOne({ _id: userId }).select(
    'favorites name email avatarUrl description',
  );

  if (!user) {
    return { user: null, totalFavoritesCount: 0 };
  }
  const totalFavoritesCount = user.favorites.length;
  const paginatedFavoriteIds = user.favorites.slice(skip, skip + perPage);
  const paginatedFavorites = await StoriesCollection.find({
    _id: { $in: paginatedFavoriteIds },
  })
    .populate('category')
    .populate({
      path: 'ownerId',
      select: 'name email avatarUrl description',
    });
  const userObject = user.toObject();
  delete userObject.favorites;
  const finalUser = {
    ...userObject,
    favorites: paginatedFavorites,
  };
  return { user: finalUser, totalFavoritesCount };
};

export const getUserCurrentStoriesService = async (
  userId,
  { page, perPage },
) => {
  const skip = (page - 1) * perPage;
  const searchCriteria = {
    ownerId: userId,
  };
  const totalItems = await StoriesCollection.countDocuments(searchCriteria);
  const stories = await StoriesCollection.find(searchCriteria)
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 })
    .populate('category')
    .populate({
      path: 'ownerId',
      select: 'name avatarUrl description',
    });
  return { stories, totalItems };
};

export const addFavorite = async (userId, storyId) => {
  const story = await StoriesCollection.findById(storyId);
  if (!story) {
    throw createHttpError(404, 'Sorry, story not found');
  }
  if (story.ownerId.toString() === userId.toString()) {
    throw createHttpError(400, 'You cannot add your own story to favorites');
  }
  const user = await UsersCollection.findById(userId);
  if (user.favorites.includes(storyId)) {
    throw createHttpError(409, 'Story already in favorites');
  }
  user.favorites.push(storyId);
  await user.save();

  await StoriesCollection.findByIdAndUpdate(storyId, {
    $inc: { favoriteCount: 1 },
  });
  const populatedUser = await UsersCollection.findById(userId).populate(
    'favorites',
  );
  return populatedUser.favorites;
};

export const updateUserCurrentService = async (userId, updateData) => {
  const user = await UsersCollection.findOneAndUpdate(
    { _id: userId },
    updateData,
    { new: true },
  );
  return user;
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
    .sort({ [sortBy]: sortOrder, _id: -1 })
    .skip(skip)
    .limit(perPage)
    .populate({ path: 'ownerId', select: 'name avatarUrl' })
    .populate({ path: 'category', select: 'name' })
    .lean();

  const [articles, total] = await Promise.all([
    articlesQuery,
    StoriesCollection.countDocuments(filter),
  ]);
  console.log(articles);
  const paginationData = calculatePaginationData(total, perPage, page);

  return {
    data: { user, articles },
    ...paginationData,
  };
};
