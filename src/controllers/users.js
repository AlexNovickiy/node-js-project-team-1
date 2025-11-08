import { getUserCurrentService, getUsers } from '../services/users.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getUsersController = async (req, res) => {
  // TODO: Сервіс для getUsers(req.query) (пагінація)
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const data = await getUsers({ page, perPage, sortBy, sortOrder });
  res
    .status(200)
    .json({ status: 200, message: 'Successfully found users!', data });
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
