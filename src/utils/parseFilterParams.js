const parseCategory = (category) => {
  const isString = typeof category === 'string' ? category : undefined;

  if (!isString) {
    return undefined;
  }

  const isCategory = [
    '68fb50c80ae91338641121f2',
    '68fb50c80ae91338641121f3',
    '68fb50c80ae91338641121f0',
    '68fb50c80ae91338641121f1',
    '68fb50c80ae91338641121f4',
    '68fb50c80ae91338641121f6',
    '68fb50c80ae91338641121f7',
    '68fb50c80ae91338641121f8',
    '68fb50c80ae91338641121f9',
  ].includes(category)
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
