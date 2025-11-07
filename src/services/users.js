import { UsersCollection } from '../db/models/user.js';
import { StoriesCollection } from '../db/models/story.js';

export const getUserCurrentService = async (userId, { page, perPage }) => {
  const skip = (page - 1) * perPage;
 const user = await UsersCollection.findOne({ _id: userId }).select(
    'favorites name email',
  );

  if (!user) {
    return { user: null, totalFavoritesCount: 0 };
  }
  const totalFavoritesCount = user.favorites.length;
  const paginatedFavoriteIds = user.favorites.slice(skip, skip + perPage);
  const paginatedFavorites = await StoriesCollection.find({
    _id: { $in: paginatedFavoriteIds },
  });
  const userObject = user.toObject();
  delete userObject.favorites;
  const finalUser = {
    ...userObject,
    favorites: paginatedFavorites, 
  };
  return { user: finalUser, totalFavoritesCount };
};
