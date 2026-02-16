// utils/productCsvFormatter.js

exports.formatProductForCSV = (product) => {
  return {
    id: product._id?.toString() || "",

    productId: product.productId || "",

    name: product.title?.en || "",

    description: product.description?.en || "",

    sku: product.sku || "",

    barcode: product.barcode || "",

    price: product.prices?.price || 0,

    originalPrice: product.prices?.originalPrice || 0,

    discount: product.prices?.discount || 0,

    stock: product.stock || 0,

    sales: product.sales || 0,

    category: product.categories
      ?.map((c) => c.name?.en || c.toString())
      .join(","),

    brand: product.brand?.name || "",

    images: product.image?.join(","),

    tags: product.tag?.join(","),

    status: product.status || "show",

    taxRate: product.taxRate || 0,

    isPriceInclusive: product.isPriceInclusive ? "Yes" : "No",

    hsnCode: product.hsnCode || "",

    batchNo: product.batchNo || "",

    expDate: product.expDate
      ? new Date(product.expDate).toISOString()
      : "",

    manufactureDate: product.manufactureDate
      ? new Date(product.manufactureDate).toISOString()
      : "",

    isWholesale: product.isWholesaler ? "Yes" : "No",

    wholePrice: product.wholePrice || 0,

    minQuantity: product.minQuantity || 0,

    isCombination: product.isCombination ? "Yes" : "No",

    averageRating: product.averageRating || 0,

    totalRatings: product.totalRatings || 0,

    totalReviews: product.totalReviews || 0,

    slug: product.slug || "",

    createdAt: product.createdAt
      ? new Date(product.createdAt).toISOString()
      : "",

    updatedAt: product.updatedAt
      ? new Date(product.updatedAt).toISOString()
      : "",
  };
};



// CSV → Mongo
exports.formatCSVToProduct = (row) => {
  return {
    productId: row.productId,

    title: {
      en: row.name,
    },

    description: {
      en: row.description,
    },

    sku: row.sku,

    barcode: row.barcode,

    prices: {
      price: Number(row.price),
      originalPrice: Number(row.originalPrice),
      discount: Number(row.discount),
    },

    stock: Number(row.stock),

    sales: Number(row.sales) || 0,

    image: row.images
      ? row.images.split(",").map((i) => i.trim())
      : [],

    tag: row.tags
      ? row.tags.split(",").map((t) => t.trim())
      : [],

    status: row.status,

    taxRate: Number(row.taxRate),

    isPriceInclusive: row.isPriceInclusive === "Yes",

    hsnCode: row.hsnCode,

    batchNo: row.batchNo,

    expDate: row.expDate ? new Date(row.expDate) : null,

    manufactureDate: row.manufactureDate ? new Date(row.manufactureDate) : null,

    isWholesaler: row.isWholesale === "Yes",

    wholePrice: Number(row.wholePrice) || 0,

    minQuantity: Number(row.minQuantity) || 0,

    isCombination: row.isCombination === "Yes",

    slug: row.slug,
  };
};
