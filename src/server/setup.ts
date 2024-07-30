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

const addOrderConfirmationEmailTemplates = async db => {
  const emailTemplatesCount = await db
    .collection("emailTemplates")
    .countDocuments({ name: "order_confirmation" })
  const emailTemplatesNotExists = emailTemplatesCount === 0
  if (emailTemplatesNotExists) {
    await db.collection("emailTemplates").insertOne({
      name: "order_confirmation",
      subject: "Order confirmation",
      body: `<div>
			<div><b>Order number</b>: {{number}}</div>
			<div><b>Shipping method</b>: {{shipping_method}}</div>
			<div><b>Payment method</b>: {{payment_method}}</div>
		  
			<div style="width: 100%; margin-top: 20px;">
			  Shipping to<br /><br />
			  <b>Full name</b>: {{shipping_address.full_name}}<br />
			  <b>Address 1</b>: {{shipping_address.address1}}<br />
			  <b>Address 2</b>: {{shipping_address.address2}}<br />
			  <b>Postal code</b>: {{shipping_address.postal_code}}<br />
			  <b>City</b>: {{shipping_address.city}}<br />
			  <b>State</b>: {{shipping_address.state}}<br />
			  <b>Phone</b>: {{shipping_address.phone}}
			</div>
		  
			<table style="width: 100%; margin-top: 20px;">
			  <tr>
				<td style="width: 40%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: left;">Item</td>
				<td style="width: 25%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: right;">Price</td>
				<td style="width: 10%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: right;">Qty</td>
				<td style="width: 25%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: right;">Total</td>
			  </tr>
		  
			  {{#each items}}
			  <tr>
				<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: left;">{{name}}<br />{{variant_name}}</td>
				<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: right;">$ {{price}}</td>
				<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: right;">{{quantity}}</td>
				<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: right;">$ {{price_total}}</td>
			  </tr>
			  {{/each}}
		  
			</table>
		  
			<table style="width: 100%; margin: 20px 0;">
			  <tr>
				<td style="width: 80%; padding: 10px 0px; text-align: right;"><b>Subtotal</b></td>
				<td style="width: 20%; padding: 10px 0px; text-align: right;">$ {{subtotal}}</td>
			  </tr>
			  <tr>
				<td style="width: 80%; padding: 10px 0px; text-align: right;"><b>Shipping</b></td>
				<td style="width: 20%; padding: 10px 0px; text-align: right;">$ {{shipping_total}}</td>
			  </tr>
			  <tr>
				<td style="width: 80%; padding: 10px 0px; text-align: right;"><b>Included Tax (VAT) @{{tax_rate}}</b></td>
				<td style="width: 20%; padding: 10px 0px; text-align: right;">$ {{tax_total}}</td>
			  </tr>
			  <tr>
				<td style="width: 80%; padding: 10px 0px; text-align: right;"><b>Grand total</b></td>
				<td style="width: 20%; padding: 10px 0px; text-align: right;">$ {{grand_total}}</td>
			  </tr>
			</table>
		  
		  </div>`,
    })

    winston.info("- Added email template for Order Confirmation")
  }
}

