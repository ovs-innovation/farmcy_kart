import requests from "./httpService";

const RefundServices = {
  addRefundReason: async (body) => {
    return requests.post("/refund/add", body);
  },

  getRefundData: async () => {
    return requests.get("/refund/all");
  },

  updateRefundReason: async (id, body) => {
    return requests.put(`/refund/${id}`, body);
  },

  updateStatus: async (id, body) => {
    return requests.put(`/refund/status/${id}`, body);
  },

  updateRefundMode: async (body) => {
    return requests.put("/refund/mode/update", body);
  },

  deleteRefundReason: async (id) => {
    return requests.delete(`/refund/${id}`);
  },
};

export default RefundServices;
