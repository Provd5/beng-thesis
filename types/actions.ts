type ActionSuccess = {
  success: true;
  error?: never;
};
type ActionError = {
  success: false;
  error: string;
};

export type ActionResponseType = Promise<ActionSuccess | ActionError>;
