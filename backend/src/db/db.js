const mongoose = require('mongoose');

function connectDB() {
    const uri = (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Reegy').trim();
    const options = {
        family: 4,
         connectTimeoutMS: 10000,
    };

    mongoose.connect(uri, options)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB', err);
        });
}

module.exports = connectDB; 