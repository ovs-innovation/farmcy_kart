import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const useFilter = (data) => {
  const [pending, setPending] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [delivered, setDelivered] = useState([]);
  const [sortedField, setSortedField] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const router = useRouter();

  // console.log("sortedfield", sortedField, data);

  const productData = useMemo(() => {
    let services = data || [];

    // Filter by Brand
    if (selectedBrands.length > 0) {
      services = services.filter((product) =>
        selectedBrands.includes(product.brand?._id || product.brand)
      );
    }

    // Filter by Category
    if (selectedCategories.length > 0) {
      services = services.filter((product) =>
        selectedCategories.includes(product.category?._id || product.category)
      );
    }

    // Filter by Price
    services = services.filter(
      (product) =>
        product.prices?.price >= priceRange.min &&
        product.prices?.price <= priceRange.max
    );

    // Filter by Rating
    if (selectedRating > 0) {
      services = services.filter(
        (product) => (product.averageRating || 0) >= selectedRating
      );
    }

    // Filter by Discount
    if (selectedDiscount > 0) {
      services = services.filter(
        (product) => (product.prices?.discount || 0) >= selectedDiscount
      );
    }

    //filter user order
    if (router.pathname === "/user/dashboard") {
      const orderPending = services?.filter(
        (statusP) => statusP.status === "Pending"
      );
      setPending(orderPending);

      const orderProcessing = services?.filter(
        (statusO) => statusO.status === "Processing"
      );
      setProcessing(orderProcessing);

      const orderDelivered = services?.filter(
        (statusD) => statusD.status === "Delivered"
      );
      setDelivered(orderDelivered);
    }

    //service sorting with low and high price
    if (sortedField === "Low") {
      services = [...services].sort((a, b) => a.prices.price - b.prices.price);
    }
    if (sortedField === "High") {
      services = [...services].sort((a, b) => b.prices.price - a.prices.price);
    }
    if (sortedField === "newest") {
      services = [...services].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    if (sortedField === "best-selling") {
      services = [...services].sort((a, b) => (b.sales || 0) - (a.sales || 0));
    }
    if (sortedField === "most-discounted") {
      services = [...services].sort(
        (a, b) => (b.prices?.discount || 0) - (a.prices?.discount || 0)
      );
    }

    return services;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sortedField,
    data,
    selectedBrands,
    priceRange,
    selectedCategories,
    selectedRating,
    selectedDiscount,
  ]);

  return {
    productData,
    pending,
    processing,
    delivered,
    setSortedField,
    selectedBrands,
    setSelectedBrands,
    priceRange,
    setPriceRange,
    selectedCategories,
    setSelectedCategories,
    selectedRating,
    setSelectedRating,
    selectedDiscount,
    setSelectedDiscount,
  };
};

export default useFilter;
