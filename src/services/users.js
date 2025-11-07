import { UsersCollection } from '../db/models/user.js';
import { StoriesCollection } from '../db/models/story.js';

export const getUserCurrentService = async (userId) => {
  return await UsersCollection.findOne({ _id: userId })
    .select('-password')
    .populate('favorites'); 
};
