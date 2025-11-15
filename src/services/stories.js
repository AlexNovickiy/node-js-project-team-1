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
    storiesQuery
      .sort({ favoriteCount: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: 'ownerId', select: 'name avatarUrl' })
      .populate({ path: 'category', select: 'name' })
      .exec(),
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
  };

  const newStory = await StoriesCollection.create(newStoryData);

  return newStory;
};

export const updateStory = async (storyId, ownerId, payload, options = {}) => {
  const rawResult = await StoriesCollection.findOneAndUpdate(
    { _id: storyId, ownerId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;
  return {
    story: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
