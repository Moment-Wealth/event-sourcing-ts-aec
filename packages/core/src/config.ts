export class Config {
  static MONGO_DB_NAME = process.env.MONGO_DB_NAME;
  static MONGO_SECRET_KEY = process.env.MONGO_SECRET_KEY;
  static MONGO_USER_ID = process.env.MONGO_USER_ID;
  static DYNAMODB_DB_NAME = process.env.DYNAMODB_DB_NAME;
}
