import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { Plus, X, UploadCloud, Info } from "lucide-react"; // npm install lucide-react
import toast from "react-hot-toast";

const AddProduct = () => {
  const { navigate, axios } = useAppContext();

  const [files, setFiles] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [price, setPrice] = useState("");

  const [offerPrice, setOfferPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleImageChange = (file, index) => {
    if(file) {
      const updated = [...files];
      updated[index] = file;
      setFiles(updated);
    }
  };

  const removeImage = (index) => {
    const updated = [...files];
    updated[index] = null;
    setFiles(updated);
  };


  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const { data } = await axios.post("/api/category/add", {
        name: newCategory,
      });

      if (data.success) {
        toast.success("Category added");

        setCategory(data.category.name);
        setShowNewCategory(false);
        setNewCategory("");

        // optionally refetch categories
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  const fetchCategories = async () => {
    const { data } = await axios.get("/api/category/list");
    if (data.success) {
      setCategories(data.categories);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  //  Handles product creation form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Prevent invalid pricing
    if (Number(offerPrice) > Number(price)) {
      alert("Offer price cannot be greater than the original price");
      return;
    }

    try {
      setLoading(true);

      // Build multipart form data (images + fields)
      const formData = new FormData();

      files.forEach((file) => {
        if (file) formData.append("images", file);
      });

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);

      // Send request (cookies auto-attached via withCredentials)
      const { data } = await axios.post("/api/product/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Success handling
      if (data.success) {
        toast.success("Product added successfully!");

        // 🧹 Reset form
        setFiles([null, null, null, null]);
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);

      } else {
        toast.error(data.message || "Failed to add product");
      }

    } catch (err) {
      console.error("Add product error:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex-1 min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">

        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Create New <span className="text-primary">Listing</span>
            </h1>
            <p className="text-gray-500 mt-2 flex items-center gap-2">
              <Info size={16} /> Showcase your fresh stock to thousands of customers.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Visuals */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Product Media</h2>
              <div className="grid grid-cols-2 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <label className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all
                      ${file ? 'border-primary/20 bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}>

                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleImageChange(e.target.files[0], index)}
                      />

                      {file ? (
                        <img
                          src={URL.createObjectURL(file)}
                          className="w-full h-full object-cover rounded-xl"
                          alt="preview"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400">
                          <UploadCloud size={24} className="mb-1" />
                          <span className="text-[10px] font-medium uppercase">Slot {index + 1}</span>
                        </div>
                      )}
                    </label>
                    {file && (
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
                * Tip: Use high-quality JPG or PNG images with white backgrounds for better sales.
              </p>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">

              {/* Product Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Organic Alphonso Mangoes (1kg)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Category</label>
                <div className="flex flex-col gap-3">
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition appearance-none"
                    value={category}
                    onChange={(e) => e.target.value === "__new__" ? setShowNewCategory(true) : setCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}

                    <option value="__new__" className="text-primary font-bold">+ Create New Category</option>
                  </select>

                  {showNewCategory && (
                    <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <input
                        className="flex-1 px-4 py-2 border-2 border-primary/30 rounded-xl outline-none"
                        placeholder="New category name..."
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dull transition"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Product Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the freshness, origin, and nutritional value..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Pricing Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Base Price ($)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Deal Price ($)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition font-semibold text-primary"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Publishing to Store...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Confirm & Add Product
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;