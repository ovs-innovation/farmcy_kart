import requests from "./httpServices";

const fallbackCategories = [
  {
    _id: "demo-cat-1",
    name: { en: "Medicines", de: "Medikamente" },
    icon: "/placeholder.png",
    nested: [],
    children: []
  },
  {
    _id: "demo-cat-2",
    name: { en: "Vitamins & Supplements", de: "Vitamine & Nahrungsergänzungsmittel" },
    icon: "/placeholder.png",
    nested: [],
    children: []
  },
  {
    _id: "demo-cat-3",
    name: { en: "Personal Care", de: "Körperpflege" },
    icon: "/placeholder.png",
    nested: [],
    children: []
  }
];

const CategoryServices = {
  getShowingCategory: async () => {
    try {
      const res = await requests.get("/category/show");
      return res && res.length > 0 ? res : fallbackCategories;
    } catch (error) {
      return fallbackCategories;
    }
  },
  getAllCategories: async () => {
    try {
      const res = await requests.get("/category/all");
      return res && res.length > 0 ? res : fallbackCategories;
    } catch (error) {
      return fallbackCategories;
    }
  },
};

export default CategoryServices;
