import { UsersCollection } from '../db/models/user.js';
import { StoriesCollection } from '../db/models/story.js';
import createHttpError from 'http-errors';

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

  return { userId, storyId };

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
  .populate({
        path: 'ownerId', 
        select: 'name email avatarUrl description'
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
    .sort({ createdAt: -1 });
  return { stories, totalItems };
export const getUserCurrentService = async (userId) => {
  return await UsersCollection.findOne({ _id: userId })
    .select('-password')
    .populate('favorites');
};

export const updateUserCurrentService = async (userId, updateData) => {
  const user = await UsersCollection.findOneAndUpdate(
    { _id: userId },
    updateData,
    { new: true },
  );
  return user;
};
