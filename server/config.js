const config = {
  // mongoURL: process.env.MONGO_URL || 'mongodb://125.212.253.105:8081/diginex',
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/diginex',
  port: process.env.PORT || 11212,
};

export default config;
