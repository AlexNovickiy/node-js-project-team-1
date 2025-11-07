import { UsersCollection } from '../db/models/user.js';
import { StoriesCollection } from '../db/models/story.js';

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
