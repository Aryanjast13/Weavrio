// product.js:

const products = [
  {
    name: "Celio Men Striped Pockets T-shirt",
    description: "Men Striped Pockets T-shirt",
    price: 2299, // Using mrp as original price
    discountPrice: 1333, // Using price as discounted price
    countInStock: 8, // From inventoryInfo (only one size shown, using its inventory)
    sku: "32878972", // Using productId as unique sku
    category: "Tshirts",
    brand: "Celio",
    sizes: ["S", "M", "L", "XL", "XXL"], // From sizes string, split by comma
    colors: ["Mustard"], // From primaryColour (colourVariants empty)
    collections: "Summer 2025", // From season and year
    material: "", // Not available in data
    gender: "Men", // From gender
    images: [
      {
        url: "http://assets.myntassets.com/assets/images/2025/FEBRUARY/20/CSEdt9tz_9ee06d6a5b85455098197aaf086b5230.jpg",
        altText: "Celio Men Striped Pockets T-shirt default",
      },
      {
        url:"http://assets.myntassets.com/assets/images/2025/FEBRUARY/20/A6P94fcN_57c10031ea7447109f6b00b1c868efb6.jpg" ,
        altText: "Celio Men Striped Pockets T-shirt bottom",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2025/FEBRUARY/20/CSEdt9tz_9ee06d6a5b85455098197aaf086b5230.jpg",
        altText: "Celio Men Striped Pockets T-shirt search",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2025/FEBRUARY/20/DCrzlGXK_59988658f97c47d9b7a2a866fcd7b6b3.jpg",
        altText: "Celio Men Striped Pockets T-shirt right",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2025/FEBRUARY/20/d9F5nDgI_79d4fca444f341b6be231f471b22d4c9.jpg",
        altText: "Celio Men Striped Pockets T-shirt left",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2025/FEBRUARY/20/rCziiRne_443c38ec5afb4985bfb81a52d7812a93.jpg",
        altText: "Celio Men Striped Pockets T-shirt top",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2025/FEBRUARY/20/wAWYMhev_7f39b00144ba46858ba57684b91d0a6d.jpeg",
        altText: "Celio Men Striped Pockets T-shirt front",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2025/FEBRUARY/20/kRkIKMyE_9d67ed26d2ef45f9bb7cb95c51a3da55.jpg",
        altText: "Celio Men Striped Pockets T-shirt back",
      },
    ],
    isFeatured: false, // No bestseller tag
    isPublished: true, // Assuming published since listed
    rating: 3.90910005569458,
    numReviews: 11,
    tags: ["Deal of the Day"], // From systemAttributes
    user: "mockUserId123", // Mock ObjectId (replace with actual ref)
    metaTitle: "Celio Men Striped Pockets T-shirt",
    metaDescription: "Men Striped Pockets T-shirt",
    metaKeywords: "Deal of the Day",
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    weight: 0,
  },
  {
    name: "STRCH Men Anti Odour Abstract Printed Round Neck T-shirt",
    description: "Men Printed Round Neck T-shirt",
    price: 2499, // Using mrp as original price
    discountPrice: 999, // Using price as discounted price
    countInStock: 46, // From inventoryInfo (only one size shown, using its inventory)
    sku: "32760282", // Using productId as unique sku
    category: "Tshirts",
    brand: "STRCH",
    sizes: ["M", "L", "XL", "XXL", "3XL"], // From sizes string, split by comma
    colors: ["Green"], // From primaryColour (colourVariants empty)
    collections: "Summer 2025", // From season and year
    material: "", // Not available in data
    gender: "Men", // From gender
    images: [
      {
        url: "http://assets.myntassets.com/assets/images/32760282/2025/6/23/b9089b91-5263-4b61-ba08-30ed2cc7e7681750680545339-STRCH-Men-Anti-Odour-Abstract-Printed-Round-Neck-T-shirt-714-1.jpg",
        altText: "STRCH Men Anti Odour Abstract Printed Round Neck T-shirt default",
      },
      {
        url: "http://assets.myntassets.com/assets/images/32760282/2025/6/23/04ab93a2-c3a7-430d-8bf0-20bf7cc267f11750680545197-STRCH-Men-Anti-Odour-Abstract-Printed-Round-Neck-T-shirt-714-6.jpg",
        altText: "STRCH Men Anti Odour Abstract Printed Round Neck T-shirt top",
      },
      {
        url: "http://assets.myntassets.com/assets/images/32760282/2025/6/23/6411e8d6-df08-427a-8b85-a2f8af12d2a61750680545280-STRCH-Men-Anti-Odour-Abstract-Printed-Round-Neck-T-shirt-714-3.jpg",
        altText: "STRCH Men Anti Odour Abstract Printed Round Neck T-shirt back",
      },
      {
        url: "http://assets.myntassets.com/assets/images/32760282/2025/6/23/694e5e66-0f54-40de-af7b-fb00c4c04fbb1750680545171-STRCH-Men-Anti-Odour-Abstract-Printed-Round-Neck-T-shirt-714-7.jpg",
        altText: "STRCH Men Anti Odour Abstract Printed Round Neck T-shirt bottom",
      },
      {
        url: "http://assets.myntassets.com/assets/images/32760282/2025/6/23/90e4b691-eb74-4ac9-9f8d-503f70b3239d1750680545252-STRCH-Men-Anti-Odour-Abstract-Printed-Round-Neck-T-shirt-714-4.jpg",
        altText: "STRCH Men Anti Odour Abstract Printed Round Neck T-shirt right",
      },
      {
        url: "http://assets.myntassets.com/assets/images/32760282/2025/6/23/33c03877-bae8-41d6-83db-4245d67bf8351750680545310-STRCH-Men-Anti-Odour-Abstract-Printed-Round-Neck-T-shirt-714-2.jpg",
        altText: "STRCH Men Anti Odour Abstract Printed Round Neck T-shirt front",
      },
      {
        url: "http://assets.myntassets.com/assets/images/32760282/2025/6/23/b9089b91-5263-4b61-ba08-30ed2cc7e7681750680545339-STRCH-Men-Anti-Odour-Abstract-Printed-Round-Neck-T-shirt-714-1.jpg",
        altText: "STRCH Men Anti Odour Abstract Printed Round Neck T-shirt search",
      },
      {
        url: "http://assets.myntassets.com/assets/images/32760282/2025/6/23/85c8b4ee-4883-4706-8623-9e25570368611750680545225-STRCH-Men-Anti-Odour-Abstract-Printed-Round-Neck-T-shirt-714-5.jpg",
        altText: "STRCH Men Anti Odour Abstract Printed Round Neck T-shirt left",
      },
    ],
    isFeatured: false, // No bestseller tag
    isPublished: true, // Assuming published since listed
    rating: 0,
    numReviews: 0,
    tags: ["Price Crash"], // From systemAttributes
    user: "mockUserId123", // Mock ObjectId (replace with actual ref)
    metaTitle: "STRCH Men Anti Odour Abstract Printed Round Neck T-shirt",
    metaDescription: "Men Printed Round Neck T-shirt",
    metaKeywords: "Price Crash",
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    weight: 0,
  },
  {
    name: "Marks & Spencer Men Striped V-Neck Pockets T-shirt",
    description: "Men Striped V-Neck Pockets T-shirt",
    price: 3499, // Using mrp as original price
    discountPrice: 3149, // Using price as discounted price
    countInStock: 2, // From inventoryInfo (only one size shown, using its inventory)
    sku: "33763197", // Using productId as unique sku
    category: "Tshirts",
    brand: "Marks & Spencer",
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"], // From sizes string, split by comma
    colors: ["Navy Blue"], // From primaryColour (colourVariants empty)
    collections: "Summer 2025", // From season and year
    material: "", // Not available in data
    gender: "Men", // From gender
    images: [
      {
        url: "http://assets.myntassets.com/assets/images/2025/APRIL/24/gokeqzSq_0ba936cfb0ee4e81a50eda9faeeea8bf.jpg",
        altText: "Marks & Spencer Men Striped V-Neck Pockets T-shirt default",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2025/APRIL/24/qgYkD1vS_95e69e5cf8cd4b579ed72f6eb66bee1a.jpg",
        altText: "Marks & Spencer Men Striped V-Neck Pockets T-shirt front",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2025/APRIL/24/QrWv3Ksl_06f531ab0edf4b238668e95a23c0850f.jpg",
        altText: "Marks & Spencer Men Striped V-Neck Pockets T-shirt left",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2025/APRIL/24/5b2PNXZe_4e3f612517164d1db0574460fd60df9c.jpg",
        altText: "Marks & Spencer Men Striped V-Neck Pockets T-shirt right",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2025/APRIL/24/wmIHZToW_1017073e76a24ba18c9d5e9f74f2bb52.jpg",
        altText: "Marks & Spencer Men Striped V-Neck Pockets T-shirt back",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2025/APRIL/24/gokeqzSq_0ba936cfb0ee4e81a50eda9faeeea8bf.jpg",
        altText: "Marks & Spencer Men Striped V-Neck Pockets T-shirt search",
      },
    ],
    isFeatured: false, // No bestseller tag
    isPublished: true, // Assuming published since listed
    rating: 0,
    numReviews: 0,
    tags: ["First time on discount", "Deal of the Day"], // From systemAttributes
    user: "mockUserId123", // Mock ObjectId (replace with actual ref)
    metaTitle: "Marks & Spencer Men Striped V-Neck Pockets T-shirt",
    metaDescription: "Men Striped V-Neck Pockets T-shirt",
    metaKeywords: "First time on discount,Deal of the Day",
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    weight: 0,
  },
  {
    name: "Crazymonk Unisex Zoro Anime Printed Cotton Oversized T-shirt",
    description: "Unisex Oversized T-shirt",
    price: 1499, // Using mrp as original price
    discountPrice: 494, // Using price as discounted price
    countInStock: 56, // From inventoryInfo (only one size shown, using its inventory)
    sku: "26684198", // Using productId as unique sku
    category: "Tshirts",
    brand: "Crazymonk",
    sizes: ["S", "M", "L", "XL", "XXL"], // From sizes string, split by comma
    colors: ["Green"], // From primaryColour (colourVariants empty)
    collections: "Summer 2023", // From season and year
    material: "", // Not available in data
    gender: "Unisex", // From gender
    images: [
      {
        url: "http://assets.myntassets.com/assets/images/26684198/2023/12/27/17557bba-1f82-4553-b6fc-2b61674d4ec51703670688784CrazymonkUnisexGreenPrintedT-shirt1.jpg",
        altText: "Crazymonk Unisex Zoro Anime Printed Cotton Oversized T-shirt default",
      },
      {
        url: "http://assets.myntassets.com/assets/images/26684198/2023/12/27/708fe3a5-a9dc-4244-ba1d-c5978521d12a1703670688791CrazymonkUnisexGreenPrintedT-shirt3.jpg",
        altText: "Crazymonk Unisex Zoro Anime Printed Cotton Oversized T-shirt back",
      },
      {
        url: "http://assets.myntassets.com/assets/images/26684198/2023/12/27/17557bba-1f82-4553-b6fc-2b61674d4ec51703670688784CrazymonkUnisexGreenPrintedT-shirt1.jpg",
        altText: "Crazymonk Unisex Zoro Anime Printed Cotton Oversized T-shirt search",
      },
      {
        url: "http://assets.myntassets.com/assets/images/26684198/2023/12/27/991732b4-60d9-4a55-8d17-96af520295001703670688763CrazymonkUnisexGreenPrintedT-shirt2.jpg",
        altText: "Crazymonk Unisex Zoro Anime Printed Cotton Oversized T-shirt front",
      },
      {
        url: "http://assets.myntassets.com/assets/images/26684198/2023/12/27/370950b4-d10a-4029-a301-43685f71aa8c1703670688771CrazymonkUnisexGreenPrintedT-shirt5.jpg",
        altText: "Crazymonk Unisex Zoro Anime Printed Cotton Oversized T-shirt left",
      },
      {
        url: "http://assets.myntassets.com/assets/images/26684198/2023/12/27/81df6a34-7c25-47b0-8de6-f6ffc9397cd41703670688777CrazymonkUnisexGreenPrintedT-shirt4.jpg",
        altText: "Crazymonk Unisex Zoro Anime Printed Cotton Oversized T-shirt right",
      },
    ],
    isFeatured: true, // Has BESTSELLER in systemAttributes
    isPublished: true, // Assuming published since listed
    rating: 4.437099933624268,
    numReviews: 302,
    tags: ["BESTSELLER", "Rising Stars", "Everyday Steal", "Deal of the Day", "Mega Price Drop", "Price Crash", "Rising Star"], // From systemAttributes
    user: "mockUserId123", // Mock ObjectId (replace with actual ref)
    metaTitle: "Crazymonk Unisex Zoro Anime Printed Cotton Oversized T-shirt",
    metaDescription: "Unisex Oversized T-shirt",
    metaKeywords: "BESTSELLER,Rising Stars,Everyday Steal,Deal of the Day,Mega Price Drop,Price Crash,Rising Star",
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    weight: 0,
  },
  {
    name: "Andamen Men Solid Polo Collar Cotton T-shirt",
    description: "Men Solid T-shirt",
    price: 2990, // Using mrp as original price
    discountPrice: 2990, // Using price as discounted price (no discount)
    countInStock: 90, // From inventoryInfo (only one size shown, using its inventory)
    sku: "30608629", // Using productId as unique sku
    category: "Tshirts",
    brand: "Andamen",
    sizes: ["S", "M", "L", "XL", "XXL"], // From sizes string, split by comma
    colors: ["Blue"], // From primaryColour (colourVariants empty)
    collections: "Winter 2024", // From season and year
    material: "", // Not available in data
    gender: "Men", // From gender
    images: [
      {
        url: "http://assets.myntassets.com/assets/images/2024/AUGUST/17/AXwc8Pes_1b16518f89bd4489812eab8fef8b9978.jpg",
        altText: "Andamen Men Solid Polo Collar Cotton T-shirt default",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2024/AUGUST/17/qbYeLtBD_19411334f1de405892c012ea94dc7112.jpg",
        altText: "Andamen Men Solid Polo Collar Cotton T-shirt right",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2024/AUGUST/17/en02ePiO_f3cca97a784e4ecbbdc671fd2c318bda.jpg",
        altText: "Andamen Men Solid Polo Collar Cotton T-shirt front",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2024/AUGUST/17/KEYAopUy_eb32b3d4b79e4a7fbc9afb3c6792687d.jpg",
        altText: "Andamen Men Solid Polo Collar Cotton T-shirt left",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2024/AUGUST/17/a3QGWSXK_465690397afc4c2eaf702478745dd889.jpg",
        altText: "Andamen Men Solid Polo Collar Cotton T-shirt bottom",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2024/AUGUST/17/6BAHNbUg_358efd2d02fa4693b235c9875b2c1948.jpg",
        altText: "Andamen Men Solid Polo Collar Cotton T-shirt top",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2024/AUGUST/17/F2pyGq4o_b1a5a6c47eca47078764aebfb85da0c6.jpg",
        altText: "Andamen Men Solid Polo Collar Cotton T-shirt back",
      },
      {
        url: "http://assets.myntassets.com/assets/images/2024/AUGUST/17/AXwc8Pes_1b16518f89bd4489812eab8fef8b9978.jpg",
        altText: "Andamen Men Solid Polo Collar Cotton T-shirt search",
      },
    ],
    isFeatured: false, // No bestseller tag
    isPublished: true, // Assuming published since listed
    rating: 0,
    numReviews: 0,
    tags: ["Rising Star"], // From systemAttributes
    user: "mockUserId123", // Mock ObjectId (replace with actual ref)
    metaTitle: "Andamen Men Solid Polo Collar Cotton T-shirt",
    metaDescription: "Men Solid T-shirt",
    metaKeywords: "Rising Star",
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    weight: 0,
  },
  {
    name: "Levis Unisex Graphic Printed Round Neck Cotton Oversized T-shirt",
    description: "Unisex Printed T-shirt",
    price: 2199, // Using mrp as original price
    discountPrice: 989, // Using price as discounted price
    countInStock: 65, // From inventoryInfo (only one size shown, using its inventory)
    sku: "31412838", // Using productId as unique sku
    category: "Tshirts",
    brand: "Levis",
    sizes: ["XS", "S", "M", "L", "XL"], // From sizes string, split by comma
    colors: ["Black"], // From primaryColour (colourVariants empty)
    collections: "Fall 2024", // From season and year
    material: "", // Not available in data
    gender: "Unisex", // From gender
    images: [
      {
        url: "http://assets.myntassets.com/assets/images/31412838/2024/11/5/adcf311a-2afc-4c61-aabb-111cca83f49c1730789226144-Levis-Men-Printed-Drop-Shoulder-Sleeves-T-shirt-763173078922-1.jpg",
        altText: "Levis Unisex Graphic Printed Round Neck Cotton Oversized T-shirt default",
      },
      {
        url: "http://assets.myntassets.com/assets/images/31412838/2024/11/27/248593da-ac73-43eb-8896-5ba9688a7c131732708534803-Levis-Unisex-Printed-Drop-Shoulder-Sleeves-T-shirt-585173270-11.jpg",
        altText: "Levis Unisex Graphic Printed Round Neck Cotton Oversized T-shirt left",
      },
      {
        url: "http://assets.myntassets.com/assets/images/31412838/2024/11/5/ea1d3002-12a6-4c5f-83c7-1896ec5e5d2b1730789226054-Levis-Men-Printed-Drop-Shoulder-Sleeves-T-shirt-763173078922-5.jpg",
        altText: "Levis Unisex Graphic Printed Round Neck Cotton Oversized T-shirt image11",
      },
      {
        url: "http://assets.myntassets.com/assets/images/31412838/2024/11/5/adcf311a-2afc-4c61-aabb-111cca83f49c1730789226144-Levis-Men-Printed-Drop-Shoulder-Sleeves-T-shirt-763173078922-1.jpg",
        altText: "Levis Unisex Graphic Printed Round Neck Cotton Oversized T-shirt search",
      },
      {
        url: "http://assets.myntassets.com/assets/images/31412838/2024/11/27/55cb4f11-beef-4795-99e0-c565c083dd671732708534845-Levis-Unisex-Printed-Drop-Shoulder-Sleeves-T-shirt-585173270-6.jpg",
        altText: "Levis Unisex Graphic Printed Round Neck Cotton Oversized T-shirt back",
      },
      {
        url: "http://assets.myntassets.com/assets/images/31412838/2024/11/27/891b832e-dac8-4eca-9af7-2fdc7de18e371732708534783-Levis-Unisex-Printed-Drop-Shoulder-Sleeves-T-shirt-585173270-12.jpg",
        altText: "Levis Unisex Graphic Printed Round Neck Cotton Oversized T-shirt image12",
      },
      {
        url: "http://assets.myntassets.com/assets/images/31412838/2024/11/5/e03a4ac3-7df1-4ce7-b29c-98e8f9c447591730789226100-Levis-Men-Printed-Drop-Shoulder-Sleeves-T-shirt-763173078922-3.jpg",
        altText: "Levis Unisex Graphic Printed Round Neck Cotton Oversized T-shirt right",
      },
      {
        url: "http://assets.myntassets.com/assets/images/31412838/2024/11/27/a2249a8c-2432-430b-a83d-a4cabdf9759f1732708534823-Levis-Unisex-Printed-Drop-Shoulder-Sleeves-T-shirt-585173270-7.jpg",
        altText: "Levis Unisex Graphic Printed Round Neck Cotton Oversized T-shirt bottom",
      },
      {
        url: "http://assets.myntassets.com/assets/images/31412838/2024/11/5/5aede0fd-5366-43ad-b5f4-f616357e41011730789226124-Levis-Men-Printed-Drop-Shoulder-Sleeves-T-shirt-763173078922-2.jpg",
        altText: "Levis Unisex Graphic Printed Round Neck Cotton Oversized T-shirt front",
      },
      {
        url: "http://assets.myntassets.com/assets/images/31412838/2024/11/5/06af04ac-ee9c-4e6a-8d48-13b85ea115be1730789226076-Levis-Men-Printed-Drop-Shoulder-Sleeves-T-shirt-763173078922-4.jpg",
        altText: "Levis Unisex Graphic Printed Round Neck Cotton Oversized T-shirt top",
      },
    ],
    isFeatured: false, // No bestseller tag
    isPublished: true, // Assuming published since listed
    rating: 4.365900039672852,
    numReviews: 205,
    tags: ["Deal of the Day", "Price Crash"], // From systemAttributes
    user: "mockUserId123", // Mock ObjectId (replace with actual ref)
    metaTitle: "Levis Unisex Graphic Printed Round Neck Cotton Oversized T-shirt",
    metaDescription: "Unisex Printed T-shirt",
    metaKeywords: "Deal of the Day,Price Crash",
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    weight: 0,
  },
];

export default products;
