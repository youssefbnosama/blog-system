export default class AppError extends Error {
  constructor(statusCode, message,isOperational,path,method) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = isOperational;
    this.path = path;
    this.method = method;
  }
}
