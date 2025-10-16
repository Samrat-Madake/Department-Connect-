const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    role :{
        type :String, 
        required: true,
        enum : ['hod','faculty','user'],
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
/*
Mongoose automatically adds two fields to each document:

createdAt → Date & time when the document was created.
updatedAt → Date & time when the document was last updated.

The document in MongoDB will look like:
{
  "_id": "654321abcdef",
  "username": "samrat",
  "password": "hashed_password",
  "role": "admin",
  "createdAt": "2025-10-13T10:00:00.000Z",
  "updatedAt": "2025-10-13T10:00:00.000Z",
  "__v": 0
}

*/