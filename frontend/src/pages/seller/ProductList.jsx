import React from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ProductList = () => {
  const { products, currency, axios, fetchProducts } = useAppContext();

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", {
        id,
        inStock
      });

      if (data.success) {
        fetchProducts(); // Refresh the product list to reflect changes
        toast.success(data.message || "Stock status updated");
      } else {
        toast.error(data.message || "Failed to update stock status");
      }
    } catch (error) {
      toast.error("Failed to update stock status");
    }
  }

  // 🔥 For now this only logs.
  // Later this is where backend DELETE call will go.
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/product/delete/${id}`);
      if (data.success) {
        fetchProducts();
        toast.success(data.message || "Product deleted");
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("DELETE ERROR:", error.response?.data || error.message);
      toast.error("Failed to delete product");
    }

  };

  return (
    <div className="flex-1 p-4 md:p-8">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          All Products
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your product inventory
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">

            {/* Table Head */}
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">
                  Product
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Category
                </th>
                <th className="px-6 py-4 text-left font-semibold hidden md:table-cell">
                  Selling Price
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400">
                    No products available
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition"
                  >
                    {/* Product Column */}
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-14 h-14 border rounded-lg overflow-hidden bg-gray-50">
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-800 truncate max-w-[200px]">
                        {product.name}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-gray-600">
                      {product.category}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-gray-800 font-medium hidden md:table-cell">
                      {currency}
                      {product.offerPrice}
                    </td>

                    {/* Stock Toggle */}
                    <td className="px-6 py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          onClick={() => toggleStock(product._id, !product.inStock)}
                          type="checkbox"
                          defaultChecked={product.inStock}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                      </label>
                    </td>

                    {/* Delete Button */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
