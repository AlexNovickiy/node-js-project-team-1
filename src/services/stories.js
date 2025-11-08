import { StoriesCollection } from '../db/models/story.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getAllStories = async ({
  page = 1,
  perPage = 10,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const storiesQuery = StoriesCollection.find();

  if (filter.category) {
    storiesQuery.where('category').equals(filter.category);
  }

  const [storiesCount, stories] = await Promise.all([
    StoriesCollection.find().merge(storiesQuery).countDocuments(),
    storiesQuery.skip(skip).limit(limit).exec(),
  ]);

  const paginationData = calculatePaginationData(storiesCount, perPage, page);

  return {
    data: stories,
    ...paginationData,
  };
};

export const createStory = async (storyData, file) => {
  const imgUrl = await saveFileToCloudinary(file);

  const newStoryData = {
    ...storyData,
    img: imgUrl,
    createdAt: new Date(),
  };

  const newStory = await StoriesCollection.create(newStoryData);

  return newStory;
};
