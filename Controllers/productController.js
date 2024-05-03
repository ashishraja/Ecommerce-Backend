import { catchAsyncErrors } from "../Middleware/catchAsyncErrors.js";
import ApiFeatures from "../Middleware/apiFeatures.js";
import cloudinary from "cloudinary";
import { Product } from "../Models/Product.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import { getDataUri } from "../Utils/dataUri.js";

export const createProduct = catchAsyncErrors(async (req, res, next) => {

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i]);

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
    message: "Product Created Successfully...",
  });
});




export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPage);

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPage,
    filteredProductsCount,
  });
});



export const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});


//Product can be updated by the ADMIN only.
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i]);

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  product = await product.save();

  res.status(200).json({
    success: true,
    product,
    message: "Product Updated Successfully"
  });
});


export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  } else {
    await cloudinary.v2.uploader.destroy(product.poster.public_id);
    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully."
    });
  }
});

export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  } else {
    res.status(200).json({
      success: true,
      product
    });
  }
});


export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, productId, comment } = req.body;

  const review = {
    name: req.user.name,
    user: req.user._id,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());
  if (isReviewed) {
    product.reviews.forEach(
      (rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
  } else {
    product.reviews.push(review);
    product.noOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg = avg + rev.rating;
  })

  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

export const getAllProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404))
  }

  res.status(201).json({
    success: true,
    reviews: product.reviews,
  });
})


export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return next(new ErrorHandler("Product Not Found", 404));
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

    let avg = 0;
    reviews.forEach((rev) => {
      avg = avg + rev.rating;
    });
    let ratings, noOfReviews;

    if (reviews.length === 0) {
      ratings = 0;
      noOfReviews = 0;
    } else {
      ratings = avg / reviews.length;
      noOfReviews = reviews.length;
    }
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        noOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: "Review Deleted Successfully",
    });
  } catch (error) {
    console.error('Error in deleteReview:', error);
    next(error);
  }
});
