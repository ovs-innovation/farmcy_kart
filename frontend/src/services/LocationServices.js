import requests from "./httpServices";

const LocationServices = {
  getReverseGeocode: async (body) => {
    return requests.post("/location/reverse-geocode", body);
  },
};

export default LocationServices;
