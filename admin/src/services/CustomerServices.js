import requests from "./httpService";

const CustomerServices = {
  getAllCustomers: async ({ searchText = "", filterType = "" }) => {
    const params = new URLSearchParams();
    if (searchText) params.append("searchText", searchText);
    if (filterType) params.append("filterType", filterType);
    return requests.get(`/customer?${params.toString()}`);
  },

  addAllCustomers: async (body) => {
    return requests.post("/customer/add/all", body);
  },
  // user create
  createCustomer: async (body) => {
    return requests.post(`/customer/create`, body);
  },

  filterCustomer: async (email) => {
    return requests.post(`/customer/filter/${email}`);
  },

  getCustomerById: async (id) => {
    return requests.get(`/customer/${id}`);
  },

  updateCustomer: async (id, body) => {
    return requests.put(`/customer/${id}`, body);
  },

  deleteCustomer: async (id) => {
    return requests.delete(`/customer/${id}`);
  },

  // Admin: Get wholesalers
  getAllWholesalers: async ({ searchText = "" } = {}) => {
    const params = new URLSearchParams();
    if (searchText) params.append("searchText", searchText);
    return requests.get(`/customer/wholesalers?${params.toString()}`);
  },

  // Create wholesaler (admin)
  createWholesaler: async (body) => {
    return requests.post(`/customer/wholesaler`, body);
  },

  // Delete cloudinary asset
  deleteCloudinaryAsset: async (publicId) => {
    return requests.post(`/customer/cloudinary-delete`, { publicId });
  },

  // Send credentials to wholesaler (admin action)
  sendCredentials: async (id, body = {}) => {
    return requests.post(`/customer/send-credentials/${id}`, body);
  },

  getCustomerStatistics: async () => {
    return requests.get("/customer/statistics");
  },
};

export default CustomerServices;
