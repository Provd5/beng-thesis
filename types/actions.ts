type ActionSuccess = {
  success: true;
  error?: never;
};
type ActionError = {
  success: false;
  error: string;
};

export type ActionResponseType = Promise<ActionSuccess | ActionError>;

type QuerySuccess<T> = {
  data: T;
  error?: never;
};
type QueryError = {
  data?: never;
  error: string;
};

export type QueryResponseType<T> = Promise<QuerySuccess<T> | QueryError>;
