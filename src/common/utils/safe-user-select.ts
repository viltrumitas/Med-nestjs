export const safeUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
};

export const caseWithAuthor = {
  include: {
    author: {
      select: safeUserSelect,
    },
    reviews: true,
  },
};
