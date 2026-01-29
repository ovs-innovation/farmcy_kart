import requests from "./httpServices";

const CustomerServices = {
  loginCustomer: async (body) => {
    return requests.post("/customer/login", body);
  },

  verifyEmailAddress: async (body) => {
    return requests.post("/customer/verify-email", body);
  },
  verifyPhoneNumber: async (body) => {
    return requests.post("/customer/verify-phone", body);
  },
  loginWithPhone: async (body) => {
    return requests.post("/customer/login-phone", body);
  },

  registerCustomer: async (token, body) => {
    return requests.post(`/customer/register/${token}`, body);
  },

  createWholesaler: async (formData) => {
    // formData should be a FormData instance
    return requests.post(`/customer/wholesaler`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  signUpWithOauthProvider: async (body) => {
    return requests.post(`/customer/signup/oauth`, body);
  },

  signUpWithProvider(token, body) {
    return requests.post(`/customer/signup/${token}`, body);
  },

  forgetPassword: async (body) => {
    return requests.put("/customer/forget-password", body);
  },

  resetPassword: async (body) => {
    return requests.put("/customer/reset-password", body);
  },

  changePassword: async (body) => {
    return requests.post("/customer/change-password", body);
  },

  updateCustomer: async (id, body) => {
    return requests.put(`/customer/${id}`, body);
  },

  // Create wholesaler - accepts JSON payload with file URLs
  createWholesaler: async (body) => {
    return requests.post(`/customer/wholesaler`, body);
  },

  deleteCloudinary: async (body) => {
    return requests.post(`/customer/cloudinary-delete`, body);
  },

  getShippingAddress: async ({ userId = "" }) => {
    return requests.get(`/customer/shipping/address/${userId}`);
  },

  addShippingAddress: async ({ userId = "", shippingAddressData }) => {
    return requests.post(
      `customer/shipping/address/${userId}`,
      shippingAddressData
    );
  },

  getCustomerById: async (id) => {
    return requests.get(`/customer/${id}`);
  },
};

export default CustomerServices;
