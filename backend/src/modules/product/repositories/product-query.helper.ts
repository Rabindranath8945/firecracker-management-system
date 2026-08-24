export const activeProductFilter = {
  $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
} as const;
