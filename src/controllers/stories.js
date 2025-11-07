import { StoriesCollection } from '../db/models/story.js';
//import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';


import { getAllStories } from '../services/stories.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

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

    const imgUrl = await saveFileToCloudinary(req.file);

    const storyData = {
      ...req.body,
      ownerId: req.user._id,
      img: imgUrl,
      createdAt: new Date(),
    };

    const newStory = await StoriesCollection.create(storyData);

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
  // TODO: Сервіс для updateStory(req.params.storyId, req.body, req.user.id)
  const data = {
    message: 'Story PATCH endpoint placeholder',
    storyId: req.params.storyId,
    body: req.body,
    file: req.file,
    userId: req.user.id,
  };
  res.status(200).json({ status: 200, data });
};
