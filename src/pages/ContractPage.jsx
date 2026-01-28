import React, { useEffect, useState } from 'react';
import { getAllContracts, createContract } from '../api/contractApi';

const ContractPage = () => {
  const [contracts, setContracts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '', 
    mobile: '', 
    email: '', 
    address: '',
    no_of_laptop: '', 
    starting_date: '', 
    end_date: '', 
    price: ''
  });

  // Load Data on Mount
  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const { data } = await getAllContracts();
      setContracts(data);
    } catch (err) {
      console.error("Error fetching contracts", err);
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Sending data without signature field
      await createContract(formData);
      
      setIsModalOpen(false);
      setFormData({
        username: '', mobile: '', email: '', address: '',
        no_of_laptop: '', starting_date: '', end_date: '', price: ''
      }); // Reset form
      
      loadContracts(); // Refresh table
      alert("Contract Created successfully!");
    } catch (err) {
      alert("Error saving contract");
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Contract Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Contract
        </button>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 text-gray-700 font-semibold">Contract No.</th>
              <th className="p-4 text-gray-700 font-semibold">Customer</th>
              <th className="p-4 text-gray-700 font-semibold">Mobile</th>
              <th className="p-4 text-gray-700 font-semibold">Laptops</th>
              <th className="p-4 text-gray-700 font-semibold">End Date</th>
              <th className="p-4 text-gray-700 font-semibold">Price</th>
            </tr>
          </thead>
          <tbody>
            {contracts.length > 0 ? (
              contracts.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-blue-700">{item.contract_number}</td>
                  <td className="p-4">{item.username}</td>
                  <td className="p-4">{item.mobile}</td>
                  <td className="p-4">{item.no_of_laptop}</td>
                  <td className="p-4">{item.end_date}</td>
                  <td className="p-4 font-bold text-gray-900">₹{item.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-500">No contracts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- CREATE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Create New Contract</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <input type="text" name="username" value={formData.username} required onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter customer name" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                  <input type="text" name="mobile" value={formData.mobile} required onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter mobile" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Email (optional)" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Customer address" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600">Number of Laptops</label>
                  <input type="number" name="no_of_laptop" value={formData.no_of_laptop} required onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600">Total Price</label>
                  <input type="number" name="price" value={formData.price} required onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Amount in ₹" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600">Starting Date</label>
                  <input type="date" name="starting_date" value={formData.starting_date} required onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600">End Date</label>
                  <input type="date" name="end_date" value={formData.end_date} required onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 shadow-md transition-all active:scale-95"
                >
                  Save Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractPage;