import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
    title: { type: String, unique: true },
    log: Object
  });

const UserSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    campaigns: [CampaignSchema]
});

const User = mongoose.model('User', UserSchema);

export default User;