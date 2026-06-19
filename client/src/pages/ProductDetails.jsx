import { useEffect, useState, useContext } from "react";

import { useParams, useNavigate } from "react-router-dom";

import {
  IndianRupee,
  Tag,
  Package,
  ArrowLeft,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";

import api from "../utils/api";

import { AuthContext } from "../context/AuthContext";

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600";

function ProductDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  // FETCH PRODUCT
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);

      setProduct(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // MARK SOLD
  const handleMarkSold = async () => {
    try {
      const res = await api.put(
        `/products/${id}/status`,
        {
          status: "Sold",
        }
      );

      setProduct(res.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);

      navigate("/marketplace");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-white p-10">
          Loading product...
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="text-white p-10">
          Product not found
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-300 hover:text-white mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* IMAGE */}
          <div>
            <img
              src={
                product.images?.[0] ||
                DEFAULT_FALLBACK_IMAGE
              }
              alt={product.title}
              className="w-full h-[500px] object-cover rounded-3xl border border-slate-800"
              onError={(e) => {
                e.target.src =
                  DEFAULT_FALLBACK_IMAGE;
              }}
            />
          </div>

          {/* DETAILS */}
          <div>

            <div className="flex items-start justify-between gap-4">
              <h1 className="text-4xl font-bold text-white">
                {product.title}
              </h1>

              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  product.status === "Sold"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {product.status}
              </span>
            </div>

            {/* PRICE */}
            <div className="flex items-center gap-2 text-indigo-400 mt-6">
              <IndianRupee size={28} />

              <span className="text-3xl font-bold">
                {product.price}
              </span>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-3">
                Description
              </h2>

              <p className="text-slate-300 leading-7">
                {product.description}
              </p>
            </div>

            {/* INFO */}
            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-3 text-slate-300">
                <Tag size={18} />
                Category: {product.category}
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Package size={18} />
                Condition: {product.condition}
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <ShoppingBag size={18} />
                Seller: {product.seller?.name}
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 size={18} />
                Status: {product.status}
              </div>
            </div>

            {/* SELLER */}
            <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-5">

              <h3 className="text-lg font-semibold text-white mb-4">
                Seller Information
              </h3>

              <div className="space-y-2 text-slate-300">

                <p>
                  Name: {product.seller?.name}
                </p>

                <p>
                  Branch: {product.seller?.branch}
                </p>

                <p>
                  Semester: {product.seller?.semester}
                </p>

                <p>
                  Email: {product.seller?.email}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            {user?._id === product.seller?._id && (
              <div className="flex gap-4 mt-8">

                {product.status !== "Sold" && (
                  <button
                    onClick={handleMarkSold}
                    className="flex-1 bg-green-600 hover:bg-green-500 transition-all py-3 rounded-2xl text-white font-semibold"
                  >
                    Mark Sold
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-500 transition-all py-3 rounded-2xl text-white font-semibold"
                >
                  Delete Product
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ProductDetails;