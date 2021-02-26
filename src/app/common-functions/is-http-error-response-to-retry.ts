export const IS_HTTP_ERROR_RESPONSE_TO_RETRY = (status: number): boolean => {
  if (status === 0) {
    return true;
  } else if (status >= 300 && status < 400) {
    return true;
  } else if (status >= 400 && status < 600) {
    return true;
  } else {
    return false;
  }
};
