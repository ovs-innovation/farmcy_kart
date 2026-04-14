import requests from "./httpService";

const AdminServices = {
  registerAdmin: async (body) => {
    return requests.post("/admin/register", body);
  },

  loginAdmin: async (body) => {
    return requests.post(`/admin/login`, body);
  },

  forgetPassword: async (body) => {
    return requests.put("/admin/forget-password", body);
  },

  resetPassword: async (body) => {
    return requests.put("/admin/reset-password", body);
  },

  signUpWithProvider: async (body) => {
    return requests.post("/admin/signup", body);
  },

  addStaff: async (body) => {
    return requests.post("/admin/add", body);
  },
  getAllStaff: async (params = {}) => {
    const { searchText, role } = params;
    const query = new URLSearchParams();
    if (searchText) query.append("searchText", searchText);
    if (role) query.append("role", role);
    return requests.get(`/admin?${query.toString()}`);
  },
  getStaffById: async (id, body) => {
    return requests.post(`/admin/${id}`, body);
  },

  updateStaff: async (id, body) => {
    return requests.put(`/admin/${id}`, body);
  },

  updateStaffStatus: async (id, body) => {
    return requests.put(`/admin/update-status/${id}`, body);
  },

  deleteStaff: async (id) => {
    return requests.delete(`/admin/${id}`);
  },
};

export default AdminServices;
