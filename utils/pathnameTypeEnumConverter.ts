export const convertPathnameToTypeEnum = (pathname: string): string => {
  return pathname.toUpperCase().replace("-", "_");
};

export const convertTypeEnumToPathname = (typeEnum: string): string => {
  return typeEnum.toLowerCase().replace("_", "-");
};
