import requests from "./httpServices";

const TestimonialServices = {
  getPublicTestimonials: async () => {
    return requests.get("/testimonials");
  },
};

export default TestimonialServices;

