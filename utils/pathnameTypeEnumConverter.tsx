export const convertPathnameToTypeEnum = (pathname: string): string => {
  return pathname.toLocaleUpperCase().replace("-", "_");
};

export const convertTypeEnumToPathname = (typeEnum: string): string => {
  return typeEnum.toLocaleLowerCase().replace("_", "-");
};
