import requests from "./httpServices";

const ProductServices = {
  getShowingProducts: async () => {
    return requests.get("/products/show");
  },
  getShowingStoreProducts: async ({
    category = "",
    title = "",
    slug = "",
    brand = "",
  }) => {
    return requests.get(
      `/products/store?category=${category}&title=${title}&slug=${slug}&brand=${brand}`
    );
  },
  getDiscountedProducts: async () => {
    return requests.get("/products/discount");
  },

  getProductBySlug: async (slug) => {
    return requests.get(`/products/${slug}`);
  },
  // Track product view
  addProductView: async (body) => {
    return requests.post("/products/view", body);
  },

  // Get suggested products
  getSuggestedProducts: async ({ productIds }) => {
    // If we have productIds (guest mode), send them as query params
    const queryString = productIds ? `?productIds=${productIds}` : "";
    return requests.get(`/products/suggested${queryString}`);
  },};

export default ProductServices;
