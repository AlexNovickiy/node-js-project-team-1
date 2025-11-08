import { getUserCurrentService,
  getUserByIdService
 } from "../services/users.js";
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getUsersController = async (req, res) => {
  // TODO: Сервіс для getUsers(req.query) (пагінація)
  const data = { message: 'Users GET endpoint placeholder' };
  res.status(200).json({ status: 200, data });
};

export const getUserByIdController = async (req, res) => {
  // TODO: Сервіс для getUserById(req.params.userId)
  const { userId } = req.params;  
  const { page, perPage } = parsePaginationParams(req.query);  
  let { sortBy, sortOrder } = parseSortParams(req.query);
  sortBy = 'favoriteCount';

  const result = await getUserByIdService({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  res.status(200).json({
    status: 200,
    message: 'User GET by ID placeholder',
    data: result.data,   
    page: result.page,
    perPage: result.perPage,
    total: result.total,
    pages: result.pages,
  });
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
