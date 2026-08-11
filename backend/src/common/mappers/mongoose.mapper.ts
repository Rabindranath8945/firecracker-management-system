type MongooseLike = {
  _id: unknown;
  toObject?: () => Record<string, unknown>;
};

export function toDto<T extends MongooseLike>(document: T) {
  const obj = document.toObject ? document.toObject() : { ...document };

  const { _id, ...rest } = obj;

  return {
    id: String(_id),
    ...rest,
  };
}

export function toDtoArray<T extends MongooseLike>(documents: T[]) {
  return documents.map(toDto);
}
