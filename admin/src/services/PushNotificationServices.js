import requests from "@/services/httpService";

const PushNotificationServices = {
  addPushNotification: async (body) => {
    return requests.post("/push-notification/add", body);
  },

  getAllPushNotifications: async () => {
    return requests.get("/push-notification");
  },

  getPushNotificationById: async (id) => {
    return requests.get(`/push-notification/${id}`);
  },

  updatePushNotification: async (id, body) => {
    return requests.put(`/push-notification/${id}`, body);
  },

  updateStatus: async (id, body) => {
    return requests.put(`/push-notification/status/${id}`, body);
  },

  deletePushNotification: async (id) => {
    return requests.delete(`/push-notification/${id}`);
  },

  deleteManyPushNotifications: async (body) => {
    return requests.patch("/push-notification/delete-many", body);
  },
};

export default PushNotificationServices;
