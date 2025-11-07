import { removeArticle } from '../services/users.js';
import { getUserCurrentService } from '../services/users.js';
import { updateUserCurrentService } from '../services/users.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getUsersController = async (req, res) => {
  // TODO: Сервіс для getUsers(req.query) (пагінація)
  const data = { message: 'Users GET endpoint placeholder' };
  res.status(200).json({ status: 200, data });
};

export const getUserByIdController = async (req, res) => {
  // TODO: Сервіс для getUserById(req.params.userId)
  // TODO: Не забути .populate('favorites')
  const data = {
    message: 'User GET by ID placeholder',
    userId: req.params.userId,
  };
  res.status(200).json({ status: 200, data });
};

export const getCurrentUserController = async (req, res) => {
  // TODO: Сервіс для getUserById(req.user.id)
  const userId = req.user._id;
  const data = await getUserCurrentService(userId);
  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved current user data',
    data,
  });
};

export const updateCurrentUserController = async (req, res) => {
  // TODO: Сервіс для updateUser(req.user.id, req.body, req.file)

  const userId = req.user._id;
  const { description } = req.body;
  const avatar = req.file;
  let avatarUrl;

  if (avatar) {
    avatarUrl = await saveFileToCloudinary(avatar);
  }

  const updateData = {};
  if (description) updateData.description = description;
  if (avatarUrl) updateData.avatarUrl = avatarUrl;

  const updatedUser = await updateUserCurrentService(userId, updateData);

  res.status(200).json({
    status: 200,
    message: 'User profile updated successfully',
    data: updatedUser,
  });
};

export const addFavoriteController = async (req, res) => {
  // TODO: Сервіс для addFavorite(req.user.id, req.body.storyId)
  const data = {
    message: 'Favorite POST placeholder',
    userId: req.user.id,
    storyId: req.body.storyId,
  };
  res.status(200).json({ status: 200, data });
};

export const removeFavoriteController = async (req, res) => {
  // TODO: Сервіс для removeFavorite(req.user.id, req.params.storyId)
  const storyId = req.params.storyId;
  const userId = req.user.id;

  const article = await removeArticle(userId, storyId);

  res.status(200).json({
    status: 200,
    data: {
      message: 'Removed from favorites',
      ...article,
    },
  });
};
