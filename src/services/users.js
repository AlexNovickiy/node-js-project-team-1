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
};
