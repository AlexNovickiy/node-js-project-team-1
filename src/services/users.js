import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { StoriesCollection } from '../db/models/story.js';

export const getUserCurrentService = async (userId) => {
  return await UsersCollection.findOne({ _id: userId })
    .select('-password')
    .populate('favorites');
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

  return user;
};
