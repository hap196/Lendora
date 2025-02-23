import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NFTCard from './components/NFTCard';

const Profile = () => {
  const [purchasedLoans, setPurchasedLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPurchasedLoans = async () => {
    try {
      const response = await axios.get('http://localhost:3001/my-loans');
      setPurchasedLoans(response.data);
    } catch (error) {
      console.error('Error fetching purchased loans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedLoans();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="text-center py-12 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg">Loading your loans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-3xl font-bold text-white mb-8">My Purchased Loans</h2>
      
      {purchasedLoans.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg">You haven't purchased any loans yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchasedLoans.map((loan, index) => (
            <div key={index} className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">Loan #{loan.serialNumber}</h3>
                  <span className="bg-blue-900/50 text-blue-300 px-3 py-1.5 rounded-full">
                    {(loan.fraction * 100).toFixed(2)}% Owned
                  </span>
                </div>
                
                <div className="bg-gray-900/40 rounded-lg p-3 space-y-3 border border-gray-700/50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Token ID</span>
                    <span className="text-gray-200">{loan.tokenId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Purchase Date</span>
                    <span className="text-gray-200">
                      {new Date(loan.purchaseDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;