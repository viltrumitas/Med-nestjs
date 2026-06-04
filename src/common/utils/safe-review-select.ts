export const SAFE_REVIEW_SELECT = {
  id: true,
  feedback: true,
  createdAt: true,
  teacher: {
    select: {
      id: true,
      email: true,
      name: true,
    },
  },
};
