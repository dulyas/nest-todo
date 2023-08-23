export type IQueryObjectItem = "up" | "down" | "disabled";

export type IQueryObject = {
  [string: string]: IQueryObjectItem;
};

export type IOrderByCfg = {
  [key: string]: 1 | -1;
};

export type IPage<T> = {
  total: number;
  results: T[];
};
