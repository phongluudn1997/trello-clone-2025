export const moveItem = <TItem>(array: TItem[], from: number, to: number) => {
  const item = array[from];
  return insertItemAtIndex(removeItemAtIndex(array, from), item, to);
};

export const removeItemAtIndex = <TItem>(array: TItem[], index: number) => {
  if (index < 0 || index >= array.length) {
    throw new Error(`Index is out of bound`);
  }
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const insertItemAtIndex = <TItem>(
  array: TItem[],
  item: TItem,
  index: number,
) => {
  if (index < 0 || index > array.length) {
    throw new Error(`Index is out of bound`);
  }
  return [...array.slice(0, index), item, ...array.slice(index)];
};
