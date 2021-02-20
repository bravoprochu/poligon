export function isHttpErrorResponseToRetry(status: number): boolean {
  if (status === 0) {
    return true;
  } else if (status >= 300 && status < 400) {
    return true;
  } else if (status >= 400 && status < 600) {
    return true;
  } else {
    return false;
  }
}
