export const getStoriesController = async (req, res) => {
  // TODO: Сервіс для getAllStories(req.query) (пагінація, фільтрація)
  const data = { message: 'Stories GET endpoint placeholder' };
  res.status(200).json({ status: 200, data });
};

export const getStoryByIdController = async (req, res) => {
  // TODO: Сервіс для getStoryById(req.params.storyId)
  const data = { message: 'Story GET by ID endpoint placeholder' };
  res.status(200).json({ status: 200, data });
};

export const createStoryController = async (req, res) => {
  // TODO: Сервіс для createStory(storyData)
  // TODO: Сервіс має:
  // 1. $inc: { articlesAmount: 1 } (або інша логіка) в User
  const storyData = {
    ...req.body,
    ownerId: req.user.id,
    img: req.file,
  };
  const data = {
    message: 'Story POST endpoint placeholder',
    data: storyData,
  };
  res.status(201).json({ status: 201, data });
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
