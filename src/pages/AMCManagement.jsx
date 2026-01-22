import React, { useState } from "react";
import { X, Plus } from "lucide-react";

export default function AMCManagement() {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    customerType: "new",
    customerName: "",
    duration: "12 Months",
    fees: "",
    products: "",
    amcType: "New",
    termsAccepted: false,
    customerSignature: "",
    staffSignature: "",
  });

  const handleSubmit = () => {
    if (
      !formData.customerName ||
      !formData.customerSignature ||
      !formData.staffSignature ||
      !formData.termsAccepted
    ) {
      alert("Please complete all mandatory fields");
      return;
    }

    console.log("AMC Submitted:", formData);
    setShowModal(false);
  };

  const calculateExpiryDate = (startDate, durationMonths) => {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + durationMonths);
  return date;
};

const getAMCStatus = (expiryDate) => {
  const today = new Date();
  const diffDays = Math.ceil(
    (new Date(expiryDate) - today) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "Expired";
  if (diffDays <= 30) return "Near Expiry";
  return "Active";
};


  return (
    <div className="w-[58rem] mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            AMC Booking & Renewal
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create or renew Annual Maintenance Contracts
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
        >
          <Plus size={16} /> Add AMC
        </button>
      </div>

      {/* EMPTY STATE */}
      <div className="bg-gray-50 border border-dashed rounded-xl p-10 text-center text-gray-400">
        No AMC records yet.
      </div>

      {/* AMC MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 relative">
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 bg-gray-900 text-white p-2 rounded-lg"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-6">
              AMC Registration Form
            </h3>

            <div className="space-y-4">
              {/* Customer Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Customer Type
                </label>
                <select
                  className="w-full bg-gray-50 border text-gray-900 border-gray-300 rounded-lg px-3 py-2"
                  value={formData.customerType}
                  onChange={(e) =>
                    setFormData({ ...formData, customerType: e.target.value })
                  }
                >
                  <option value="new">New Customer</option>
                  <option value="existing">Existing Customer</option>
                </select>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                />
              </div>

              {/* AMC Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    AMC Type
                  </label>
                  <select
                    className="w-full bg-gray-50 border text-gray-900 border-gray-300 rounded-lg px-3 py-2"
                    value={formData.amcType}
                    onChange={(e) =>
                      setFormData({ ...formData, amcType: e.target.value })
                    }
                  >
                    <option>New</option>
                    <option>Renewal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Duration
                  </label>
                  <select
                    className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-3 py-2"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                  >
                    <option>6 Months</option>
                    <option>12 Months</option>
                    <option>24 Months</option>
                  </select>
                </div>
              </div>

              {/* Fees */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  AMC Fees (₹)
                </label>
                <input
                  type="number"
                  className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter amount"
                  value={formData.fees}
                  onChange={(e) =>
                    setFormData({ ...formData, fees: e.target.value })
                  }
                />
              </div>

              {/* Products */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Products Covered
                </label>
                <textarea
                  className="w-full bg-gray-50 border text-gray-900 border-gray-300 rounded-lg px-3 py-2"
                  placeholder="List covered products"
                  rows={2}
                  value={formData.products}
                  onChange={(e) =>
                    setFormData({ ...formData, products: e.target.value })
                  }
                />
              </div>

           

              {/* Terms */}
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      termsAccepted: e.target.checked,
                    })
                  }
                />
                I agree to AMC terms & conditions *
              </label>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
            >
              Submit AMC
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
