import requests from "./httpService";

const PrescriptionServices = {
  getAllPrescriptions: async () => {
    return requests.get("/prescriptions");
  },

  getPrescriptionById: async (id) => {
    return requests.get(`/prescriptions/${id}`);
  },

  updatePrescriptionStatus: async (id, body) => {
    return requests.put(`/prescriptions/${id}/status`, body);
  },

  deletePrescription: async (id) => {
    return requests.delete(`/prescriptions/${id}`);
  },
};

export default PrescriptionServices;
