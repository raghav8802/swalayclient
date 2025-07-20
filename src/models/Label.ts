import mongoose, { Schema, Document } from 'mongoose';

export interface iLabel extends Document {
  uniqueUsername? : string
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string; // Optional field
  contact: string;
  razor_contact: string;
  password: string;
  usertype: string;
  verifyCode: string;
  verifyCodeExpiry: Date | null; // Corrected type
  instagram?: string; // Optional field
  facebook?: string; // Optional field
  ytMusic?: string; // Optional field
  spotify?: string; // Optional field
  appleMusic?: string; // Optional field
  isVerified: boolean;
  isLable: boolean;
  lable: string | null; // Specify this can also be null
  joinedAt: Date;
  subscriptionEndDate: Date;
  signature: string;
  state: string;
}


const LabelSchema: Schema<iLabel> = new Schema({
  uniqueUsername : {
    type : String,
    default : null
  },
  username: {
    type: String,
    required: [true, 'Username required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    trim: true,
    unique: true,
    // eslint-disable-next-line no-useless-escape
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  bio: {
    type: String,
    default: null,
    trim: true,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  contact: {
    type: String, // Changed from Number to String
    required: [true, 'Number required'],
    trim: true,
    // unique: true,
    match: [/^(\+?\d{1,4}[\s.-]?)?(\(?\d{3}\)?[\s.-]?)?[\d\s.-]{7,10}$/, 'Please use a valid contact number'],
  },
  razor_contact: {
    type: String,
    // required: [true, 'Razorpay contact ID required'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    trim: true,
  },
  usertype: {
    type: String,
    enum: ['normal', 'super'],
    default: 'super',
  },
  verifyCode: {
    type: String,
    default: undefined,
  },
  verifyCodeExpiry: {
    type: Date,
    default: undefined,
  },
  instagram: {
    type: String,
    default: null,
  },
  facebook: {
    type: String,
    default: null,
  },
  ytMusic: {
    type: String,
    default: null,
  },
  spotify: {
    type: String,
    default: null,
  },
  appleMusic: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isLable: {
    type: Boolean,
    default: false,
  },
  lable: {
    type: String,
    default: null,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  subscriptionEndDate: {
    type: Date,
    default: Date.now,
  },
  signature: {
    type: String,
    default: null,
  },
  state: {
    type: String,
    // required: [true, 'State is required'],
    // required: false,
    trim: true,
  },
});

const Label = (mongoose.models.Labels as mongoose.Model<iLabel>) || mongoose.model<iLabel>('Labels', LabelSchema);

export default Label;
