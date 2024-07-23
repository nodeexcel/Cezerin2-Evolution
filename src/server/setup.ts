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
