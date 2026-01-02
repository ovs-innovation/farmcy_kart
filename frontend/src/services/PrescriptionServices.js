import requests from "./httpServices";

const PrescriptionServices = {
  uploadPrescription: async (data) => {
    return requests.post("/prescriptions/upload", data);
  },
  getUserPrescriptions: async (userId) => {
    return requests.get(`/prescriptions/user/${userId}`);
  },
  getPrescriptionById: async (id) => {
    return requests.get(`/prescriptions/${id}`);
  },
  getAllPrescriptions: async () => {
    return requests.get("/prescriptions");
  },
  markAsAddedToCart: async (id) => {
    return requests.put(`/prescriptions/${id}/added-to-cart`);
  },
};

export default PrescriptionServices;

