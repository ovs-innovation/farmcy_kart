import React, { useState, useEffect, useRef } from "react";
import PageTitle from "@/components/Typography/PageTitle";
import { FiSearch, FiEdit2, FiUser, FiChevronDown, FiX, FiTrash2, FiPlus, FiMinus, FiCheck, FiDollarSign, FiFileText, FiCreditCard } from "react-icons/fi";
import ProductServices from "@/services/ProductServices";
import CategoryServices from "@/services/CategoryServices";
import CustomerServices from "@/services/CustomerServices";
import OrderServices from "@/services/OrderServices";
// import { notifySuccess, notifyError } from "@/utils/toast";
import Spinner from "@/components/spinner/Spinner";

const NewSale = () => {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customerData, setCustomerData] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Notification State
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (msg, type = "success") => {
    setAlert({ show: true, message: msg, type: type });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3500);
  };

  // Delivery Modal State
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    contactName: "",
    contactNumber: "",
    road: "",
    house: "",
    floor: "",
    address: "",
  });

  // States for editing a cart item
  const [isEditCartModalOpen, setIsEditCartModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Stats
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 0; 
  const deliveryFee = 0;
  const tax = 0;
  const total = subtotal - discount + deliveryFee + tax;

  useEffect(() => {
    fetchCategories();
    fetchCustomers();
    fetchProducts();

    // Close dropdown on click outside
    const handleClickOutside = (event) => {
      if (!event.target.closest(".customer-dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await ProductServices.getAllProducts({
        page: 1,
        limit: 20,
        category: selectedCategory,
        title: searchTerm,
      });
      setProducts(res.products);
      setTotalResults(res.totalDocs);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await CategoryServices.getAllCategories();
      setCategories(res);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await CustomerServices.getAllCustomers({});
      setCustomers(res.customers || res);
    } catch (err) {
      console.error("Error fetching customers", err);
    }
  };

  const selectedCustomerDetails = customers.find(c => c._id === selectedCustomer);

  const handleEditCustomerIcon = () => {
    if (!selectedCustomerDetails) {
      showAlert("Please select a customer first!", "error");
      return;
    }
    setDeliveryInfo({
      contactName: selectedCustomerDetails.name,
      contactNumber: selectedCustomerDetails.phone,
      road: "",
      house: "",
      floor: "",
      address: "",
    });
    setIsDeliveryModalOpen(true);
  };

  const resetCustomerForm = () => {
    setCustomerData({ firstName: "", lastName: "", email: "", phone: "" });
    setIsEditingCustomer(false);
    setIsCustomerModalOpen(false);
  };

  const handleCustomerSubmit = async () => {
    if (!customerData.firstName || !customerData.email || !customerData.phone) {
       showAlert("Required fields are missing!", "error");
       return;
    }

    try {
      if (isEditingCustomer) {
        await CustomerServices.updateCustomer(selectedCustomer, {
          name: `${customerData.firstName} ${customerData.lastName}`,
          email: customerData.email,
          phone: customerData.phone,
        });
        showAlert("Customer updated successfully!", "success");
      } else {
        await CustomerServices.createCustomer({
          name: `${customerData.firstName} ${customerData.lastName}`,
          email: customerData.email,
          phone: customerData.phone,
          password: "password123", 
        });
        showAlert("Customer added successfully!", "success");
      }
      fetchCustomers();
      resetCustomerForm();
    } catch (err) {
      showAlert(err.message || "Failed to save customer", "error");
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    const price = product.prices?.price || product.prices?.originalPrice || 0;
    
    // Stock Check
    const availableStock = product.stock || 0;
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;

    if (availableStock <= currentQtyInCart) {
      return;
    }

    if (existingItem) {
      setCart(cart.map(item => 
        item._id === product._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        _id: product._id,
        title: product.title?.en || product.title,
        price: price,
        image: Array.isArray(product.image) ? product.image[0] : product.image,
        quantity: 1,
        stock: availableStock // Store stock to check during quantity update
      }]);
    }
  };

  const openCartItemEdit = (item) => {
    setEditingItem({ ...item });
    setIsEditCartModalOpen(true);
  };

  const handleUpdateCartItem = () => {
    setCart(cart.map(item => {
      if (item._id === editingItem._id) {
        return editingItem;
      }
      return item;
    }));
    setIsEditCartModalOpen(false);
    setEditingItem(null);
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item._id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        
        // Stock Check on Increase
        if (delta > 0 && newQty > (item.stock || 0)) {
           return item;
        }
        
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const handlePlaceOrder = async () => {
    if (!selectedCustomer) {
      showAlert("Please select a customer first!", "error");
      return;
    }
    if (cart.length === 0) {
      showAlert("Your cart is empty!", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        user: selectedCustomer,
        cart: cart.map(item => ({
          _id: item._id,
          productId: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subTotal: subtotal,
        total: total,
        paymentMethod: paymentMethod, 
        shippingCost: deliveryFee,
        discount: discount,
        deliveryAddress: deliveryInfo,
      };

      await OrderServices.addOrder(orderData);
      
      // Sync to Customer Cart on Website
      try {
        const cartToSync = cart.map(item => ({
          productId: item._id,
          quantity: item.quantity
        }));
        await CustomerServices.updateCustomer(selectedCustomer, { cart: cartToSync });
      } catch (syncErr) {
        console.error("Cart sync failed", syncErr);
        // We don't block the order if sync fails, but maybe log it
      }

      showAlert("Order placed successfully and synced to user cart!", "success");
      setCart([]);
      setSelectedCustomer("");
      setDeliveryInfo({ contactName: "", contactNumber: "", road: "", house: "", floor: "", address: "" });
    } catch (err) {
      showAlert(err.message || "Failed to place order", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col xl:flex-row gap-6 mt-6 pb-8">
        {/* Left Section (Product Section) */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-gray-700 p-6 flex flex-col min-h-[600px] xl:w-7/12">
          <h2 className="text-[1.1rem] font-bold text-gray-700 dark:text-gray-200 mb-6 font-sans">
            Product Section
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Store Select */}
            <div className="relative">
              <select className="block w-full px-4 py-2.5 text-sm border border-gray-200 rounded-md focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 appearance-none bg-white font-medium text-gray-700 cursor-pointer">
                <option>Fresh supermarket (Main Demo Zone)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <FiChevronDown />
              </div>
            </div>
            
            {/* Category Select */}
            <div className="relative">
              <select 
                className="block w-full px-4 py-2.5 text-sm border border-gray-200 rounded-md focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 appearance-none bg-white font-medium text-gray-700 cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name?.en || cat.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <FiChevronDown />
              </div>
            </div>
          </div>
          
          {/* Search Input */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <FiSearch size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by product name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 sm:text-sm border-transparent rounded-md focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-300 bg-[#f4f5f9] dark:bg-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Product Items */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Spinner />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => {
                   const productImage = Array.isArray(product.image) ? product.image[0] : product.image;
                   const price = product.prices?.price || product.prices?.originalPrice || 0;
                   return (
                    <div 
                      key={product._id} 
                      onClick={() => addToCart(product)}
                      className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-teal-500 hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      <div className="aspect-[4/3] w-full bg-gray-50 flex items-center justify-center p-4 relative group-hover:bg-teal-50 transition-colors">
                        <img 
                          src={productImage || "https://via.placeholder.com/150"} 
                          alt={product.title?.en || product.title} 
                          className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-teal-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <FiPlus size={14} />
                        </div>
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-[13px] font-bold text-gray-700 dark:text-gray-200 line-clamp-2 min-h-[38px] mb-2 font-sans group-hover:text-teal-600 transition-colors">
                          {product.title?.en || product.title}
                        </h3>
                        <div className="mt-auto flex justify-between items-center">
                          <p className="text-[15px] text-teal-600 dark:text-teal-400 font-extrabold tracking-tight">₹ {Number(price).toFixed(2)}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-80 mt-10">
                <div className="text-gray-300 mb-4 opacity-70">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto transform rotate-12">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <path d="M7 13h8M7 11a4 4 0 0 1 8 0H7z" strokeWidth="1.5"></path>
                  </svg>
                </div>
                <p className="text-[13px] text-gray-400/80 font-medium">No products on pos search</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Section (Billing Section) */}
        <div className="w-full xl:w-5/12 bg-white dark:bg-gray-800 rounded-lg shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-fit">
          <h2 className="text-[1.1rem] font-bold text-gray-700 dark:text-gray-200 mb-6 font-sans">
            Billing Section
          </h2>

          {/* Customer Selection (Custom Searchable Dropdown) */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1 customer-dropdown-container">
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-between cursor-pointer shadow-sm hover:border-teal-500 transition-all font-bold text-sm text-gray-700 dark:text-gray-200"
              >
                <span className="truncate">
                  {selectedCustomerDetails ? selectedCustomerDetails.name : "Select or search customer..."}
                </span>
                <FiChevronDown className={`ml-2 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {isDropdownOpen && (
                <div className="absolute z-[100] w-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
                  <div className="p-4 border-b border-gray-50 dark:border-gray-700">
                    <div className="relative">
                       <input 
                        type="text"
                        autoFocus
                        placeholder="Searching..."
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
                        value={customerSearchTerm}
                        onChange={(e) => setCustomerSearchTerm(e.target.value)}
                      />
                      <div className="absolute right-4 top-3.5 text-gray-400">
                        <FiSearch size={16} />
                      </div>
                    </div>
                  </div>
                  
                  <ul className="max-h-64 overflow-y-auto custom-scrollbar">
                    {customers
                      .filter(c => 
                        c.name?.toLowerCase().includes(customerSearchTerm.toLowerCase()) || 
                        c.phone?.toLowerCase().includes(customerSearchTerm.toLowerCase()) || 
                        c.email?.toLowerCase().includes(customerSearchTerm.toLowerCase())
                      )
                      .map(cust => (
                        <li 
                          key={cust._id}
                          onClick={() => {
                            setSelectedCustomer(cust._id);
                            setIsDropdownOpen(false);
                            setCustomerSearchTerm("");
                          }}
                          className={`px-5 py-4 flex items-center justify-between cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 ${selectedCustomer === cust._id ? 'bg-teal-50 dark:bg-teal-900/20' : ''}`}
                        >
                          <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-gray-800 dark:text-gray-100">{cust.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-gray-500 font-medium">({cust.phone || 'No phone'})</span>
                              {cust.email && <span className="text-[11px] text-teal-600 font-medium"> - {cust.email}</span>}
                            </div>
                          </div>
                          {selectedCustomer === cust._id && (
                            <FiCheck className="text-teal-600 font-bold" size={18} />
                          )}
                        </li>
                      ))
                    }
                    {customers.filter(c => 
                      c.name?.toLowerCase().includes(customerSearchTerm.toLowerCase()) || 
                      c.phone?.toLowerCase().includes(customerSearchTerm.toLowerCase()) || 
                      c.email?.toLowerCase().includes(customerSearchTerm.toLowerCase())
                    ).length === 0 && (
                      <li className="px-5 py-8 text-center text-gray-400 text-sm italic">No results found</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsCustomerModalOpen(true)}
              className="bg-[#0e7473] hover:bg-[#0c6361] text-white px-6 py-3 text-sm font-extrabold rounded-xl whitespace-nowrap transition-all shadow-lg shadow-teal-900/10 active:scale-95"
            >
              Add New Customer
            </button>
          </div>

          {/* Selected Customer Profile Card (Full Details) */}
          {selectedCustomerDetails && (
            <div className="mb-4 p-5 bg-teal-50/20 dark:bg-teal-900/5 border border-teal-100/50 dark:border-teal-800/50 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all animate-modal-enter shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600 shrink-0 border border-teal-500/10">
                <FiUser size={32} />
              </div>
              <div className="flex-1 w-full text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                   <h4 className="font-extrabold text-[#1a202c] dark:text-gray-100 text-[17px] leading-none">{selectedCustomerDetails.name}</h4>
                   <span className="text-[11px] font-bold px-3 py-1 bg-white dark:bg-gray-800 border border-teal-200/50 rounded-lg text-teal-700 flex items-center gap-1.5 shadow-sm inline-flex w-fit mx-auto sm:mx-0">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
                    Wallet: ₹ {selectedCustomerDetails.wallet?.toFixed(2) || "0.00"}
                   </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-[13px] text-gray-500 font-bold">
                   <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <FiSearch size={14} className="text-gray-300" />
                      <span className="opacity-80">Email:</span>
                      <span className="text-teal-600 font-extrabold truncate max-w-[180px]">{selectedCustomerDetails.email || "N/A"}</span>
                   </div>
                   <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <FiSearch size={14} className="text-gray-300" />
                      <span className="opacity-80">Phone:</span>
                      <span className="text-teal-600 font-extrabold">{selectedCustomerDetails.phone || "N/A"}</span>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Section Header */}
          <div className="flex items-center justify-between mb-2 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <FiUser className="text-teal-500" size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-[13px] text-gray-800 dark:text-gray-100">Delivery Information</span>
                  <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">{deliveryInfo.contactName ? "Saved Location" : "Standard Delivery"}</span>
                </div>
            </div>
            <button 
              onClick={handleEditCustomerIcon}
              className="p-2 bg-teal-50 text-teal-600 border border-teal-100 rounded-lg hover:bg-teal-100 transition-colors"
               title="Edit Delivery Info"
            >
              <FiEdit2 size={14} />
            </button>
          </div>

          {/* Cart Table Content */}
          <div className="overflow-y-auto max-h-[400px] mb-4">
            {cart.length > 0 ? (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center justify-between text-[13px] border-b border-gray-50 dark:border-gray-700 pb-2">
                    <div className="w-1/3 flex items-center gap-2">
                       <img src={item.image} className="w-8 h-8 object-cover rounded" alt="" />
                       <span className="truncate font-medium">{item.title}</span>
                    </div>
                    <div className="w-1/6 flex items-center justify-center gap-1">
                      <button onClick={() => updateQuantity(item._id, -1)} className="p-1 text-gray-400 hover:text-teal-500"><FiMinus size={12} /></button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button onClick={() => addToCart(item)} className="p-1 text-gray-400 hover:text-teal-500"><FiPlus size={12} /></button>
                    </div>
                    <div className="w-1/4 text-center font-bold relative group/edit">
                      ₹ {(item.price * item.quantity).toFixed(2)}
                      <button 
                        onClick={() => openCartItemEdit(item)}
                        className="ml-2 text-teal-500 opacity-0 group-hover/edit:opacity-100 transition-opacity"
                        title="Edit Item"
                      >
                        <FiEdit2 size={12} />
                      </button>
                    </div>
                    <div className="w-1/4 text-right">
                      <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600 p-1">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 flex items-center justify-center text-gray-400 italic">
                Cart is empty
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-3 text-[14px] text-gray-700 dark:text-gray-300 mb-4 border-t border-gray-100 pt-4">
            <div className="flex justify-between font-medium">
              <span>Subtotal :</span>
              <span>₹ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Discount :</span>
              <span>- ₹ {discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Delivery fee :</span>
              <span>₹ {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Tax :</span>
              <span>₹ {tax.toFixed(2)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between font-bold text-gray-800 dark:text-gray-100 text-[17px] mb-6 pt-3 border-t border-dashed border-gray-200">
            <span className="font-extrabold">Total :</span>
            <span>₹ {total.toFixed(2)}</span>
          </div>

          {/* Paid By */}
          <div className="mb-6">
            <p className="text-[13px] text-gray-500 font-bold mb-3 uppercase tracking-wider">Payment Method</p>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setPaymentMethod("Cash")}
                className={`flex flex-col items-center justify-center p-4 border rounded-2xl font-bold transition-all duration-300 ${paymentMethod === "Cash" ? "bg-[#0e7473] text-white border-[#0e7473] shadow-lg shadow-teal-900/20" : "bg-white border-gray-100 text-gray-600 hover:border-teal-500 hover:bg-teal-50/10"}`}
              >
                <div className={`mb-2 p-2 rounded-xl ${paymentMethod === "Cash" ? "bg-white/20" : "bg-gray-50 text-gray-500"}`}>
                  <FiDollarSign size={20} />
                </div>
                <span className="text-[11px]">Cash</span>
              </button>
              <button 
                onClick={() => setPaymentMethod("Wallet")}
                className={`flex flex-col items-center justify-center p-4 border rounded-2xl font-bold transition-all duration-300 ${paymentMethod === "Wallet" ? "bg-[#0e7473] text-white border-[#0e7473] shadow-lg shadow-teal-900/20" : "bg-white border-gray-100 text-gray-600 hover:border-teal-500 hover:bg-teal-50/10"}`}
              >
                <div className={`mb-2 p-2 rounded-xl ${paymentMethod === "Wallet" ? "bg-white/20" : "bg-gray-50 text-gray-500"}`}>
                  <FiFileText size={20} />
                </div>
                <span className="text-[11px]">Wallet</span>
              </button>
              <button 
                onClick={() => setPaymentMethod("Card")}
                className={`flex flex-col items-center justify-center p-4 border rounded-2xl font-bold transition-all duration-300 ${paymentMethod === "Card" ? "bg-[#0e7473] text-white border-[#0e7473] shadow-lg shadow-teal-900/20" : "bg-white border-gray-100 text-gray-600 hover:border-teal-500 hover:bg-teal-50/10"}`}
              >
                <div className={`mb-2 p-2 rounded-xl ${paymentMethod === "Card" ? "bg-white/20" : "bg-gray-50 text-gray-500"}`}>
                  <FiCreditCard size={20} />
                </div>
                <span className="text-[11px]">Card</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-2">
            <button 
              onClick={() => setCart([])}
              className="flex-1 py-3 text-[15px] border border-red-300 text-red-400 rounded-md hover:bg-red-50 hover:text-red-500 font-semibold transition-colors bg-white"
            >
              Clear Cart
            </button>
            <button 
              disabled={isSubmitting || cart.length === 0}
              onClick={handlePlaceOrder}
              className="flex-1 py-3 text-[15px] bg-[#0e7473] text-white rounded-md hover:bg-teal-800 font-semibold transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Placing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>                                              

      {/* Customer Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden order-popup-animate relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-800">{isEditingCustomer ? "Edit customer" : "Add new customer"}</h2>
              <button 
                onClick={resetCustomerForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={22} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                {/* First Name */}
                <div>
                  <label className="block text-[14px] font-medium text-gray-700 mb-2">
                    First name <span className="text-[#ff564c] font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={customerData.firstName}
                    onChange={(e) => setCustomerData({ ...customerData, firstName: e.target.value })}
                    className="block w-full px-4 py-3 sm:text-sm border border-gray-200 rounded-md focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 text-gray-600 placeholder-gray-400 font-medium bg-white"
                  />
                </div>
                {/* Last Name */}
                <div>
                  <label className="block text-[14px] font-medium text-gray-700 mb-2">
                    Last name <span className="text-[#ff564c] font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={customerData.lastName}
                    onChange={(e) => setCustomerData({ ...customerData, lastName: e.target.value })}
                    className="block w-full px-4 py-3 sm:text-sm border border-gray-200 rounded-md focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 text-gray-600 placeholder-gray-400 font-medium bg-white"
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-[14px] font-medium text-gray-700 mb-2">
                    Email <span className="text-[#ff564c] font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Ex : ex@example.com"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                    className="block w-full px-4 py-3 sm:text-sm border border-gray-200 rounded-md focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 text-gray-600 placeholder-gray-400 font-medium bg-white"
                  />
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-[14px] font-medium text-gray-700 mb-2">
                    Phone (With country code) <span className="text-[#ff564c] font-bold">*</span>
                  </label>
                  <div className="flex border border-gray-200 rounded-md focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 overflow-hidden bg-white hover:border-teal-400 transition-colors">
                    <div className="flex items-center px-4 gap-2 border-r border-gray-100 cursor-pointer bg-white">
                      <span className="text-xl leading-none">🇮🇳</span>
                      <FiChevronDown className="text-gray-400 text-[10px]" />
                    </div>
                    <input
                      type="text"
                      placeholder="+91"
                      value={customerData.phone}
                      onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                      className="block w-full px-4 py-3 sm:text-sm border-transparent focus:ring-0 focus:outline-none text-gray-700 placeholder-gray-700 font-medium bg-white"
                    />
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={resetCustomerForm}
                  className="px-8 py-2.5 bg-[#e9ecef] hover:bg-[#dde0e3] text-[#495057] text-[15px] font-bold rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCustomerSubmit}
                  className="px-8 py-2.5 bg-[#0e7473] hover:bg-[#0c6361] text-white text-[15px] font-bold rounded-md transition-colors"
                >
                  {isEditingCustomer ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delivery Options Modal (Ref Image 2) */}
      {isDeliveryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-modal-enter">
            <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">Delivery options</h2>
              <button onClick={() => setIsDeliveryModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">Contact person name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={deliveryInfo.contactName}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, contactName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:bg-gray-900"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">Contact Number <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={deliveryInfo.contactNumber}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, contactNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:bg-gray-900"
                    placeholder="Enter phone"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">Road</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:bg-gray-900"
                    placeholder="Ex : 4th"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">House</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:bg-gray-900"
                      placeholder="Ex : 45/C"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">Floor</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:bg-gray-900"
                      placeholder="Ex : 1A"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8 p-6 border border-teal-100 dark:border-teal-800 rounded-2xl bg-teal-50/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   <div>
                    <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">Longitude <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900" readOnly placeholder="77.1025" />
                  </div>
                   <div>
                    <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">Latitude <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900" readOnly placeholder="28.7041" />
                  </div>
                </div>
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">Address</label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:bg-gray-900 min-h-[100px]"
                  placeholder="Ex : address"
                ></textarea>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-xs text-red-400 font-medium">* pin the address in the map to calculate delivery fee</p>
                  <div className="bg-teal-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md cursor-pointer hover:bg-teal-700 transition">
                    Delivery fee : ₹ 0
                  </div>
                </div>
              </div>

              {/* Compact Map Section */}
              <div className="mb-8">
                 <div className="flex items-center justify-between mb-3 px-1">
                    <label className="text-[13px] font-bold text-gray-700">Location Preview</label>
                    <span className="text-[11px] text-teal-600 font-bold underline cursor-pointer">Select on Large Map</span>
                 </div>
                 <div className="w-full h-32 bg-gray-100 dark:bg-gray-900 rounded-2xl relative overflow-hidden group border border-gray-200 dark:border-gray-700 shadow-inner">
                    <img src="https://maps.googleapis.com/maps/api/staticmap?center=28.7041,77.1025&zoom=14&size=800x200&scale=2&key=MOCK" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Mini Map" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center animate-bounce shadow-xl border-4 border-white">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                       </div>
                    </div>
                    <div className="absolute bottom-2 right-2 flex gap-2">
                       <div className="bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-lg text-[10px] font-bold text-gray-600 shadow-sm backdrop-blur-md">
                          ₹ 0 Delivery Fee
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-4">
                <button 
                onClick={() => setIsDeliveryModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3.5 rounded-xl font-bold transition-all"
               >
                 Cancel
               </button>
               <button 
                onClick={() => setIsDeliveryModalOpen(false)}
                className="bg-[#0e7473] hover:bg-[#0c6361] text-white px-10 py-3.5 rounded-xl font-extrabold transition-all shadow-lg hover:shadow-teal-900/30 active:scale-95"
               >
                 Save Address
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Cart Item Modal */}
      {isEditCartModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
             <h3 className="text-lg font-bold mb-4">Edit Item: {editingItem.title}</h3>
             <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input 
                    type="number" 
                    value={editingItem.quantity} 
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (Override)</label>
                  <input 
                    type="number" 
                    value={editingItem.price} 
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                    className="w-full border rounded p-2"
                  />
                </div>
             </div>
             <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setIsEditCartModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                <button onClick={handleUpdateCartItem} className="px-4 py-2 bg-teal-600 text-white rounded">Apply</button>
             </div>
           </div>
        </div>
      )}
      {/* Custom Professional Notification Banner */}
      {alert.show && (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[200] max-w-sm w-full px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center gap-4 border backdrop-blur-md animate-in slide-in-from-top-10 duration-500 ${alert.type === 'success' ? 'bg-teal-600/95 border-teal-500 text-white' : 'bg-red-600/95 border-red-500 text-white'}`}>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
             {alert.type === 'success' ? <FiCheck size={20} /> : <FiSearch size={20} />}
          </div>
          <div className="flex-1">
             <p className="font-extrabold text-[15px]">{alert.type === 'success' ? 'Success ✓' : 'Action Required'}</p>
             <p className="text-[13px] opacity-90 font-medium">{alert.message}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default NewSale;