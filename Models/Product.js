import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter Product Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter Product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please enter Product Price"],
        maxLength: [8, "Price cannot be more than 8-digit Number"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    category: {
        type: String,
        required: [true, "Please enter Product Category"]
    },
    Stock: {
        type: Number,
        required: [true, "Please enter Product Stock"],
        maxLength: [4, "Stock cannot be more than 4digit"],
        default: 1
    },
    noOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Product = mongoose.model("Product", productSchema);