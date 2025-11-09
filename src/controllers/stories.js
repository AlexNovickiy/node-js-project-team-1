import createHttpError from 'http-errors';
import * as fs from 'node:fs/promises';
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
    console.log('1. Починаю завантаження на Cloudinary...');
    const response = await saveFileToCloudinary(req.file);
    console.log('2. Завантаження на Cloudinary завершено.'); // Якщо це не виводиться, проблема у saveFileToCloudinary
    img = response;
  }
  const storyData = {
    ...req.body,
    // ...(img && { img }),
    img,
  };
  console.log('3. Починаю оновлення MongoDB...');
  const result = await updateStory(req.params.storyId, req.user.id, storyData);
  console.log('4. Оновлення MongoDB завершено.'); // Якщо це не виводиться, проблема у updateStory
  if (!result) {
    throw createHttpError(404, 'Story not found');
  }
  // const data = {
  //   message: 'Story PATCH endpoint placeholder',
  //   storyId: req.params.storyId,
  //   body: req.body,
  //   file: req.file,
  //   userId: req.user.id,
  // };
  console.log('5. Відправляю відповідь.'); // Якщо це виводиться, але клієнт зависає, проблема в налаштуваннях Express
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a story!',
    data: result.story,
  });
};
