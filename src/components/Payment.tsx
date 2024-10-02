import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2 } from "lucide-react";

const Payment = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId || !screenshot) {
      setAlertMessage('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('transactionId', transactionId);
    formData.append('screenshot', screenshot);

    try {
      const response = await axios.post(`http://${process.env['PROD-URL-BACKEND']}/team/${teamId}/pay`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        setAlertMessage('Payment submitted successfully!');
        // Redirect to dashboard after 3 seconds
        window.location.href = `/team/${teamId}`;
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      setAlertMessage('Error submitting payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-xl">Processing your payment...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-grow flex flex-col justify-center items-center px-4 md:px-6">
        <div className="w-full max-w-md space-y-6 bg-[#1a1a1a] p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Payment</h2>
          {alertMessage && (
            <Alert className="bg-blue-500 text-white p-4 rounded-lg">
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <img src="../src/assets/qr-code.png" alt="Payment QR Code" className="w-full rounded-lg" />
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="bg-[#2a2a2a] border border-gray-600 rounded-md p-2"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files ? e.target.files[0] : null)}
                className="bg-[#2a2a2a] border border-gray-600 rounded-md p-2"
              />
              <Button
                type="submit"
                className="w-full bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  'Submit Payment'
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;