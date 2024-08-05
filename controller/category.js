const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mailgun = require("mailgun-js");
const { google } = require("googleapis");
const crypto = require("crypto");
const { catchAsync } = require("../utils/catchAsync");
const { errorHandling } = require("../utils/errorHandling");
const { signedToken } = require("../utils/tokenSigning");

const Category = require("../models/category");
const { sortArray } = require("../utils/functions");

dotenv.config();

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name)
    return errorHandling(res, {
      message: "Nom sont obligatoires",
      status: 400
    });

  let newCategory = new Category({
    ...req.body
  });

  await newCategory.save();
  // fetching permissiondata
  return errorHandling(res, {
    message: "Category created successfully",
    status: 200
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let verifyCategory = await Category.findOne({ _id: id });
  if (verifyCategory) {
    await Category.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    return errorHandling(res, {
      message: "Category updated",
      status: 200
    });
  }
  return errorHandling(res, {
    message: "Category not updated",
    status: 404
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let deleteCategory = await Category.findByIdAndDelete({ _id: id });

  if (!deleteCategory)
    return errorHandling(res, {
      message: "Category not found",
      status: 404
    });

  return errorHandling(res, {
    message: "Category deleted successfully",
    status: 200
  });
});

const getCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let getCategory = await Category.findOne({ _id: id });
  if (getCategory)
    return errorHandling(res, {
      message: "Category found",
      status: 200,
      category: getCategory
    });

  return res.status(404).send({ message: "category not found" });
});

const getActifCategory = catchAsync(async (req, res, next) => {
  let allCategory = await Category.find({
    status: true
  }).sort({ _id: -1 });

  const sortedCategory = sortArray(allCategory);

  return errorHandling(res, {
    message: "Category found",
    status: 200,
    category: sortedCategory
  });
});

const getAllCategory = catchAsync(async (req, res, next) => {
  let allCategory = await Category.find().sort({ _id: -1 });
  return errorHandling(res, {
    message: "Category found",
    status: 200,
    category: allCategory
  });
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getActifCategory,
  getAllCategory
};
