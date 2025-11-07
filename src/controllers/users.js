import {
  getUserCurrentService,
  getUserCurrentStoriesService,
} from '../services/users.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

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

export const getCurrentUserController = async (req, res, next) => {
  const { page, perPage } = req.paginationParams;
  const userId = req.user._id;
  const { user, totalFavoritesCount } = await getUserCurrentService(userId, {
    page,
    perPage,
  });
  const pagination = calculatePaginationData(
    totalFavoritesCount,
    perPage,
    page,
  );
  res.status(200).json({
    status: 200,
    message: 'Current user data retrieved successfully.',
    data: {
      user,
      pagination,
    },
  });
  const data = await getUserCurrentService(userId);
  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved current user data',
    data,
  });
};

export const getCurrentUserStoriesController = async (req, res) => {
  const { page, perPage } = req.paginationParams;
  const userId = req.user._id;
  const { stories, totalItems } = await getUserCurrentStoriesService(userId, {
    page,
    perPage,
  });
  const pagination = calculatePaginationData(totalItems, perPage, page);
  const responseMessage =
    totalItems === 0
      ? "You haven't created any stories of your own yet."
      : 'Current user stories retrieved successfully.';
  res.status(200).json({
    status: 200,
    message: responseMessage,
    data: {
      stories,
      pagination,
    },
  });
};

export const updateCurrentUserController = async (req, res) => {
  // TODO: Сервіс для updateUser(req.user.id, req.body, req.file)

  const data = {
    message: 'User PATCH ME placeholder',
    userId: req.user.id,
    body: req.body,
    file: req.file,
  };
  res.status(200).json({ status: 200, data });
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
  const data = {
    message: 'Favorite DELETE placeholder',
    userId: req.user.id,
    storyId: req.params.storyId,
  };
  res.status(200).json({ status: 200, data });
};
