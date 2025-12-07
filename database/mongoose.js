const mongoose = require("mongoose");

require("dotenv").config;

const { MONGODB_URI, MONGODB_USER, MONGODB_PASS, MONGODB_DB, MONGODB_HOST } =
  process.env;

function buildUri() {
  if (MONGODB_URI && MONGODB_URI.trim() !== "") {
    return MONGODB_URI;
  }
  if (!MONGODB_USER || !MONGODB_PASS || !MONGODB_DB || !MONGODB_HOST) {
    throw new Error("Missing MongoDb env vars");
  }
  const user = encodeURIComponent(MONGODB_USER);
  const pass = encodeURIComponent(MONGODB_PASS);

  return `mongodb+srv://${user}:${pass}@${MONGODB_HOST}/${MONGODB_DB}?retryWrites=true&w=majority`;
}

const uri = buildUri();

async function connect() {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, //// optional for fast retry
    });
    console.log("MongoDB Connected", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB con err", error);
    throw error;
  }
}

function disconnect() {
  return mongoose.disconnect();
}

module.exports = {
  connect,
  disconnect,
  mongoose,
};
