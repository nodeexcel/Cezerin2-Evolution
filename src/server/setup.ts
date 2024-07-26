import { MongoClient } from "mongodb"
import winston from "winston"
import "./lib/logger"
import { mongodbConnection } from "./lib/settings"

const mongoPathName = new URL(mongodbConnection).pathname
const dbName = mongoPathName.substring(mongoPathName.lastIndexOf("/") + 1)

const CONNECT_OPTIONS = {
  useNewUrlParser: true,
}

const DEFAULT_LANGUAGE = "english"

const addPage = async (db, pageObject) => {
  const count = await db
    .collection("pages")
    .countDocuments({ slug: pageObject.slug })
  const docExists = +count > 0
  if (!docExists) {
    await db.collection("pages").insertOne(pageObject)
    winston.info(`- Added page: /${pageObject.slug}`)
  }
}

const addAllPages = async db => {
  await addPage(db, {
    slug: "",
    meta_title: "Home",
    enabled: true,
    is_system: true,
  })
  await addPage(db, {
    slug: "checkout",
    meta_title: "Checkout",
    enabled: true,
    is_system: true,
  })
  await addPage(db, {
    slug: "checkout-success",
    meta_title: "Thank You!",
    enabled: true,
    is_system: true,
  })
  await addPage(db, {
    slug: "about",
    meta_title: "About us",
    enabled: true,
    is_system: false,
  })
  await addPage(db, {
    slug: "login",
    meta_title: "Login",
    enabled: true,
    is_system: true,
  })
  await addPage(db, {
    slug: "register",
    meta_title: "Register",
    enabled: true,
    is_system: true,
  })
  await addPage(db, {
    slug: "customer-account",
    meta_title: "Customer Account",
    enabled: true,
    is_system: true,
  })
  await addPage(db, {
    slug: "forgot-password",
    meta_title: "Forgot Password",
    enabled: true,
    is_system: true,
  })
  await addPage(db, {
    slug: "reset-password",
    meta_title: "Reset Password",
    enabled: true,
    is_system: true,
  })
}

const addAllProducts = async db => {
  const productCategoriesCount = await db
    .collection("productCategories")
    .countDocuments({})

  const productsCount = await db.collection("products").countDocuments({})

  const productsNotExists = productCategoriesCount === 0 && productsCount === 0

  if (productsNotExists) {
    const catA = await db.collection("productCategories").insertOne({
      name: "Category A",
      slug: "category-a",
      image: "",
      parent_id: null,
      enabled: true,
    })

    const catB = await db.collection("productCategories").insertOne({
      name: "Category B",
      slug: "category-b",
      image: "",
      parent_id: null,
      enabled: true,
    })

    const catC = await db.collection("productCategories").insertOne({
      name: "Category C",
      slug: "category-c",
      image: "",
      parent_id: null,
      enabled: true,
    })

    const catA1 = await db.collection("productCategories").insertOne({
      name: "Subcategory 1",
      slug: "category-a-1",
      image: "",
      parent_id: catA.insertedId,
      enabled: true,
    })

    const catA2 = await db.collection("productCategories").insertOne({
      name: "Subcategory 2",
      slug: "category-a-2",
      image: "",
      parent_id: catA.insertedId,
      enabled: true,
    })

    const catA3 = await db.collection("productCategories").insertOne({
      name: "Subcategory 3",
      slug: "category-a-3",
      image: "",
      parent_id: catA.insertedId,
      enabled: true,
    })

    await db.collection("products").insertOne({
      name: "Product A",
      slug: "product-a",
      category_id: catA.insertedId,
      regular_price: 950,
      stock_quantity: 999,
      enabled: true,
      discontinued: false,
      attributes: [
        { name: "Brand", value: "Brand A" },
        { name: "Size", value: "M" },
      ],
    })

    await db.collection("products").insertOne({
      name: "Product B",
      slug: "product-b",
      category_id: catA.insertedId,
      regular_price: 1250,
      stock_quantity: 999,
      enabled: true,
      discontinued: false,
      attributes: [
        { name: "Brand", value: "Brand B" },
        { name: "Size", value: "L" },
      ],
    })

    winston.info("- Added products")
  }
}

