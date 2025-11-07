const parseCategory = (category) => {
  const isString = typeof category === 'string' ? category : undefined;

  if (!isString) {
    return undefined;
  }

  const isCategory = ['Азія', 'Пустелі', 'Європа', 'Африка'].includes(category)
    ? category
    : undefined;

  if (isCategory) {
    return isCategory;
  } else {
    return undefined;
  }
};

// TODO: Додайте інші фільтри, якщо вони знадобляться
export const parseFilterParams = (query) => {
  const { category } = query;

  const parsedCategory = parseCategory(category);

  return {
    ...(parsedCategory !== undefined && { category: parsedCategory }),
  };
};
