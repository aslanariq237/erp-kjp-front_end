const ID_TOKEN_KEY = "user" as string;

/**
 * @description get token form localStorage
 */
export const getData = (): string | null => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveData = (token: string): void => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};

/**
 * @description remove token form localStorage
 */
export const destroyData = (): void => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

export default { getData, saveData, destroyData };
