import config from "./config.js";
export const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "Fail";
  error.isOperational = error.isOperational || false;
  if (config.isDev) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      isOperational: error.isOperational,
      path: req.originalUrl,
      method: req.method,
      stack: error.stack,
      error:{...error}
    });
  } else if(config.isProd){
    if(error.isOperational){
        res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    }else{
        res.status(500).json({
        status: "error",
        message: "Something went wrong!",
      });
    }
  }
};
