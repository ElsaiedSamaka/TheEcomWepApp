const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (email) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128,
      trim: true,
      select: false,
      validate: {
        validator: (password) => {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,128}/.test(
            password
          );
        },
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 128,
      validate: {
        validator: (name) => {
          return /^[a-zA-Z ]+$/.test(name);
        },
      },
    },
    profilePhoto: {
      type: String,
      default: function () {
        return `https://secure.gravatar.com/avatar/${this._id}?s=90&d=identicon`;
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 10,
      validate: {
        validator: (phone) => {
          return /^[0-9]+$/.test(phone);
        },
      },
    },
    address: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 128,
      validate: {
        validator: (address) => {
          return /^[a-zA-Z ]+$/.test(address);
        },
        message: "Address must contain only letters and spaces.",
      },
    },
    city: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 128,
      validate: {
        validator: (city) => {
          return /^[a-zA-Z ]+$/.test(city);
        },
      },
    },
    state: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 128,
      validate: {
        validator: (state) => {
          return /^[a-zA-Z ]+$/.test(state);
        },
      },
    },
    zip: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 5,
      validate: {
        validator: (zip) => {
          return /^[0-9]+$/.test(zip);
        },
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
});
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hashSync(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});
userSchema.methods.comparePassword = function (password) {
  const user = this;
  return bcrypt.compareSync(password, user.password);
};

userModel.set("toJSON", { getters: true });
userModel.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj._id;
  delete obj.__v;
  delete obj.password;
  return obj;
};
module.exports = mongoose.model("User", userSchema);
