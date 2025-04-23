import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the Subscription document
export interface ISubscription extends Document {
  userId: string; // Reference to the user
  planId: number; // ID of the selected plan
  planName: string; // Name of the selected plan
  price: string; // Price of the plan
  features: string[]; // Features of the plan
  startDate: Date; // Subscription start date
  endDate: Date; // Subscription end date
  paymentId: string; // Razorpay payment ID
  orderId: string; // Razorpay order ID
  razorpayPaymentId: string; // Razorpay payment ID
  status: "active" | "expired" | "cancelled"; // Subscription status
  createdAt: Date; // Timestamp for when the subscription was created
  updatedAt: Date; // Timestamp for when the subscription was last updated
}

// Define the schema for the Subscription collection
const SubscriptionSchema: Schema = new Schema<ISubscription>(
  {
    userId: {
      type: String,
      required: true,
    },
    planId: {
      type: Number,
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the Subscription model

const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Support', SubscriptionSchema);

export default Subscription;