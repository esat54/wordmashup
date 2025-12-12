const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

exports.createUser = async (name, email, password) => {
    try {
        const user = new User({ name, email, password });
        await user.save();
        return user;
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Bu e-posta adresi zaten kullanılıyor');
        }
        throw error;
    }
};

exports.findUserByEmail = async (email) => {
    return await User.findOne({ email: email.toLowerCase() });
};

exports.findUserById = async (id) => {
    return await User.findById(id);
};
