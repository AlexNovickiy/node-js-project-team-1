import createHttpError from 'http-errors';

import {
  getAllStories,
  createStory,
  updateStory,
} from '../services/stories.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getStoriesController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const filter = await parseFilterParams(req.query);

  const stories = await getAllStories({
    page,
    perPage,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found stories!',
    data: stories,
  });
};

export const getStoryByIdController = async (req, res) => {
  // TODO: Сервіс для getStoryById(req.params.storyId)
  const data = { message: 'Story GET by ID endpoint placeholder' };
  res.status(200).json({ status: 200, data });
};

export const createStoryController = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createHttpError(400, 'Story image is required'));
    }

    const storyData = {
      ...req.body,
      ownerId: req.user._id,
    };

    const newStory = await createStory(storyData, req.file);

    res.status(201).json({
      status: 201,
      data: newStory,
      message: 'Story created successfully',
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

export const updateStoryController = async (req, res) => {
  let img;
  if (req.file) {
    const response = await saveFileToCloudinary(req.file);
    img = response;
  }
  const storyData = {
    ...req.body,
    img,
  };

  const result = await updateStory(req.params.storyId, req.user.id, storyData);

  if (!result) {
    throw createHttpError(404, 'Story not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a story!',
    data: result.story,
  });
};
