import {
  addFavorite,
  getUserCurrentService,
  getUserCurrentStoriesService,
  removeArticle,
  updateUserCurrentService,
  getUserByIdService,
} from '../services/users.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getUsers } from '../services/users.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getUsersController = async (req, res) => {
  // TODO: Сервіс для getUsers(req.query) (пагінація)
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const data = await getUsers(page, perPage, sortBy, sortOrder);
  res
    .status(200)
    .json({ status: 200, message: 'Successfully found users!', data });
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
    totalItems: result.totalItems,
    totalPages: result.totalPages,
    hasNextPage: result.hasNextPage,
    hasPreviousPage: result.hasPreviousPage,
  });
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
  const userId = req.user.id;
  const storyId = req.body.storyId;

  const updatedUser = await addFavorite(userId, storyId);
  res.status(200).json({
    status: 200,
    message: 'Story successfully added to favorites',
    data: {
      user: updatedUser,
    },
  });
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
