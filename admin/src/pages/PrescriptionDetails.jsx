import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Select,
} from "@windmill/react-ui";
import { FiPlus, FiTrash2, FiShoppingCart } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import PageTitle from "@/components/Typography/PageTitle";
import PrescriptionServices from "@/services/PrescriptionServices";
import ProductServices from "@/services/ProductServices";
import { notifySuccess, notifyError } from "@/utils/toast";
import useAsync from "@/hooks/useAsync";
import Spinner from "@/components/spinner/Spinner";

const PrescriptionDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [prescription, setPrescription] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMounted = useRef(false);
  const searchRef = useRef(null);
  console.log("searchResults", searchResults);

  const { data, loading } = useAsync(() =>
    PrescriptionServices.getPrescriptionById(id)
  );

  useEffect(() => {
    const enrichMedicines = async (meds, isWholesalerUser) => {
      try {
        const enriched = await Promise.all(
          meds.map(async (m) => {
            // fetch product to get minQuantity / wholePrice
            try {
              const res = await ProductServices.getProductById(m.productId);
              const product = res.product || res;
              // Apply product minQuantity only for wholesaler users. Customers keep their typed qty.
              const minQ = isWholesalerUser ? (product?.minQuantity || m.minQuantity || 1) : 1;
              const wholesalePrice = product?.wholePrice && Number(product.wholePrice) > 0 ? Number(product.wholePrice) : null;
              const priceForUser = isWholesalerUser && wholesalePrice ? wholesalePrice : (m.price || product?.prices?.price || 0);
              const qty = isWholesalerUser ? Math.max(m.quantity || 1, minQ) : (m.quantity || 1);
              return { ...m, minQuantity: minQ, price: priceForUser, quantity: qty };
            } catch (err) {
              // fallback to original medicine object
              const minQ = isWholesalerUser ? (m.minQuantity || 1) : 1;
              return { ...m, minQuantity: minQ, quantity: isWholesalerUser ? Math.max(m.quantity || 1, minQ) : (m.quantity || 1) };
            }
          })
        );
        return enriched;
      } catch (err) {
        console.error("Error enriching medicines:", err);
        return meds;
      }
    };

    if (data?.prescription) {
      setPrescription(data.prescription);
      if (data.prescription.medicines) {
        const isWholesalerUser = data.prescription.user?.role && data.prescription.user.role.toString().toLowerCase() === "wholesaler";
        enrichMedicines(data.prescription.medicines, isWholesalerUser).then((enriched) => setMedicines(enriched));
      }
    }
  }, [data]);

  // Search products
  const fetchAllProducts = async () => {
    try {
      const res = await ProductServices.getAllProducts({
        page: 1,
        limit: 15,
      });
      const isWholesalerUser = prescription?.user?.role && prescription.user.role.toString().toLowerCase() === "wholesaler";
      const filtered = isWholesalerUser
        ? res.products.filter(p => (p.wholePrice && Number(p.wholePrice) > 0) || p.isWholesaler)
        : res.products;
      setSearchResults(filtered);
      setShowResults(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      if (searchTerm.length > 0) {
        const fetchProducts = async () => {
          try {
            const res = await ProductServices.getAllProducts({
              title: searchTerm,
              page: 1,
              limit: 15,
            });
            const isWholesalerUser = prescription?.user?.role && prescription.user.role.toString().toLowerCase() === "wholesaler";
            const filtered = isWholesalerUser
              ? res.products.filter(p => (p.wholePrice && Number(p.wholePrice) > 0) || p.isWholesaler)
              : res.products;
            setSearchResults(filtered);
            setShowResults(true);
          } catch (err) {
            console.error(err);
          }
        };
        const timeoutId = setTimeout(fetchProducts, 500);
        return () => clearTimeout(timeoutId);
      } else {
        fetchAllProducts();
      }
    } else {
      isMounted.current = true;
    }
  }, [searchTerm, prescription]);

  const handleAddMedicine = (product) => {
    const exists = medicines.find((m) => m.productId === product._id);
    if (exists) {
      // If exists, remove it (toggle behavior)
      setMedicines(medicines.filter((m) => m.productId !== product._id));
      return;
    }

    const isWholesalerUser = prescription?.user?.role && prescription.user.role.toString().toLowerCase() === "wholesaler";

    const productImage = Array.isArray(product.image) 
      ? product.image[0] 
      : (typeof product.image === 'string' ? product.image : '');

    const defaultQty = isWholesalerUser ? (product.minQuantity || 1) : 1;
    const priceForUser = isWholesalerUser && product.wholePrice && Number(product.wholePrice) > 0 ? Number(product.wholePrice) : (product.prices?.price || product.prices?.originalPrice || 0);

    setMedicines([
      ...medicines,
      {
        productId: product._id,
        title: product.title?.en || product.title || "Unknown Product",
        price: priceForUser,
        image: productImage,
        quantity: defaultQty,
        minQuantity: defaultQty,
      },
    ]);
    // Do NOT clear search term or results to allow multi-selection
  };

  const handleRemoveMedicine = (index) => {
    const newMedicines = [...medicines];
    newMedicines.splice(index, 1);
    setMedicines(newMedicines);
  };

  const handleUpdateMedicine = (index, field, value) => {
    const newMedicines = [...medicines];
    if (field === "quantity") {
      const val = parseInt(value) || 1;
      const minQ = newMedicines[index].minQuantity || 1;
      newMedicines[index][field] = Math.max(val, minQ);
    } else {
      newMedicines[index][field] = value;
    }
    setMedicines(newMedicines);
  };

  const handleStatusUpdate = async (status) => {
    setIsSubmitting(true);
    try {
      await PrescriptionServices.updatePrescriptionStatus(id, {
        status,
        medicines: status === "processed" ? medicines : [],
      });
      notifySuccess(`Prescription ${status} successfully!`);
      setPrescription({ ...prescription, status });
    } catch (err) {
      notifyError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <PageTitle>{t("Prescription Details")}</PageTitle>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left Column: Prescription Image */}
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <h4 className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
              Prescription Files
            </h4>
            <div className="grid gap-4">
              {prescription?.files?.map((file, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  {file.type === "image" ? (
                    <div className="relative">
                      <img
                        src={file.url}
                        alt={`Prescription ${i + 1}`}
                        className="w-full h-auto max-h-96 object-contain rounded"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <svg
                        className="w-16 h-16 text-blue-500 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline font-medium"
                      >
                        View PDF - {file.fileName || "Prescription"}
                      </a>
                      {file.fileSize && (
                        <span className="text-xs text-gray-500 mt-2">
                          {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {prescription?.notes && (
              <div className="mt-4">
                <h5 className="font-semibold">User Notes:</h5>
                <p className="text-gray-600 dark:text-gray-400">
                  {prescription.notes}
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Right Column: Medicine Selection */}
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <h4 className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
              Doctor Review & Medicine Selection
            </h4>

            {/* Customer Info */}
            {prescription?.user && (
              <div className="mb-4 text-sm">
                
                <div className="text-gray-600">{prescription.user.name} &middot; {prescription.user.email}</div>
                <div className="mt-1">
                  <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs">
                    {prescription.user.role ? prescription.user.role.charAt(0).toUpperCase() + prescription.user.role.slice(1) : 'N/A'}
                  </span>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="relative mb-6" ref={searchRef}>
              <Input
                className="mt-1"
                placeholder="Type medicine name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={() => {
                  setShowResults(true);
                  if (searchResults.length === 0 && searchTerm === "") {
                    fetchAllProducts();
                  }
                }}
              />
              {showResults && searchResults.length > 0 && (
                <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
                  {searchResults.map((product) => {
                    const productImage = Array.isArray(product.image) 
                      ? product.image[0] 
                      : (typeof product.image === 'string' ? product.image : '');
                    const productTitle = product.title?.en || product.title || "Unknown Product";
                    const isSelected = medicines.some((m) => m.productId === product._id);
                    return (
                      <li
                        key={product._id}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center gap-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                        onClick={() => handleAddMedicine(product)}
                      >
                        <Input 
                          type="checkbox" 
                          checked={isSelected} 
                          readOnly
                          className="mr-2"
                        />
                        <img
                          src={productImage || "https://via.placeholder.com/40"}
                          alt={productTitle}
                          className="w-10 h-10 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/40";
                          }}
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium">{productTitle}</span>
                          {(() => {
                            const isWholesalerUser = prescription?.user?.role && prescription.user.role.toString().toLowerCase() === "wholesaler";
                            const wholesalePrice = product.wholePrice && Number(product.wholePrice) > 0 ? Number(product.wholePrice) : null;
                            const displayPrice = isWholesalerUser && wholesalePrice ? wholesalePrice : (product.prices?.price || product.prices?.originalPrice || null);
                            return (
                              <>
                                {displayPrice !== null && (
                                  <span className="text-xs text-gray-500 block">
                                    Price: ₹{displayPrice}
                                    {isWholesalerUser && wholesalePrice && product.minQuantity ? (
                                      <span className="ml-2 text-xs text-gray-400">(Min {product.minQuantity})</span>
                                    ) : null}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Selected Medicines List */}
            <div className="space-y-2 mb-6">
              {medicines.map((medicine, index) => (
                <div
                  key={index}
                  className="flex flex-col p-2 relative border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <img
                        src={medicine.image}
                        alt={medicine.title}
                        className="w-8 h-8 object-cover rounded flex-shrink-0"
                      />
                      <span className="text-sm font-medium truncate" title={medicine.title}>
                        {medicine.title}
                      </span>
                    </div>
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="delete"
                      onClick={() => handleRemoveMedicine(index)}
                      className="flex-shrink-0 absolute top-1 right-1"
                    >
                      <FiTrash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-2 flex justify-around items-center gap-x-4">
                      <Label className="text-xs">Qty</Label>
                      <div>
                         {medicine.minQuantity && medicine.minQuantity > 1 && (
                        <div className="text-xs text-gray-400 mt-1 w-10">Min: {medicine.minQuantity}</div>
                      )}
                      </div>
                      <div className="flex items-center mt-0.5">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => {
                            const minQ = medicine.minQuantity || 1;
                            const newQty = Math.max((medicine.quantity || 1) - 1, minQ);
                            handleUpdateMedicine(index, "quantity", String(newQty));
                          }}
                          disabled={(medicine.quantity || 1) <= (medicine.minQuantity || 1)}
                          className={`px-3 py-1 border rounded-l text-sm ${((medicine.quantity || 1) <= (medicine.minQuantity || 1)) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        >
                          -
                        </button>

                        <Input
                          type="number"
                          min={medicine.minQuantity || 1}
                          readOnly={false}
                          disabled={false}
                          className="text-sm py-1 h-8 text-center"
                          value={medicine.quantity}
                          onChange={(e) =>
                            handleUpdateMedicine(index, "quantity", e.target.value)
                          }
                        />

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => {
                            const newQty = (medicine.quantity || 1) + 1;
                            handleUpdateMedicine(index, "quantity", String(newQty));
                          }}
                          className="px-3 py-1 border rounded-r text-sm hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                     
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6">
              <Button
                className="w-full"
                onClick={() => handleStatusUpdate("processed")}
                disabled={isSubmitting || medicines.length === 0}
              >
                <FiShoppingCart className="mr-2" />
                Add to Customer Cart
              </Button>
              <Button
                layout="outline"
                className="w-full"
                onClick={() => handleStatusUpdate("rejected")}
                disabled={isSubmitting}
              >
                Reject Prescription
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default PrescriptionDetails;
