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
    },
    lastActivityDate: {
        type: Date,
        default: null
    },
    streakCount: {
        type: Number,
        default: 0
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

exports.updateUserActivity = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
    if (lastActivity) {
        lastActivity.setHours(0, 0, 0, 0);
    }

    const daysDiff = lastActivity 
        ? Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
        : 999;

    if (daysDiff === 0) {
        return user;
    } else if (daysDiff === 1) {
        user.streakCount += 1;
    } else {
        user.streakCount = 1;
    }

    user.lastActivityDate = today;
    await user.save();
    return user;
};
