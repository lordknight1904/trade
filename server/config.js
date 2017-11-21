const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://125.212.253.105:8081/diginex',
  port: process.env.PORT || 8000,
};

export default config;
