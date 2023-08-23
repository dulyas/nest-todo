import { IQueryObject, IOrderByCfg } from "./types";

export default (query: IQueryObject): IOrderByCfg => {
  const result = {};
  for (const value of Object.values(query)) {
    if (value !== "disabled") {
      result[value] = value === "down" ? 1 : -1;
    }
  }
  return result;
};
