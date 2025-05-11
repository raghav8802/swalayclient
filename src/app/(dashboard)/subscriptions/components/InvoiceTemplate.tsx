
import React from "react";
import { Subscription } from "./SubcriptionOrderHistoryDatatable";


interface InvoiceTemplateProps {
  subscription: Subscription;
  userDetails?: {
    username?: string;
    email?: string;
    contact?: string;
    lable?: string;
  };
}

const calculateGST = (price: string) => {
  const basePrice = parseFloat(price);
  const gstAmount = basePrice * 0.18;
  const total = basePrice + gstAmount;
  return {
    basePrice: basePrice.toFixed(2),
    gstAmount: gstAmount.toFixed(2),
    total: total.toFixed(2),
  };
};

export const InvoiceTemplate = ({ subscription, userDetails }: InvoiceTemplateProps) => {
  const priceCalculations = calculateGST(subscription.price);

  return (
    <div id="invoice-template" className="w-[800px] bg-white p-8">
      {/* Invoice Header */}
      <div className="bg-gradient-to-r from-[#42c5be] to-blue-800 text-white px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">PAYMENT RECEIPT</h1>
            <p className="text-blue-100 mt-1">
              Invoice Id : #{subscription.invoiceId}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">SwaLay</p>
            {/* <Image
              src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay-logo-white.png"
              alt="SwaLay Logo"
              width={150}
              height={200}
              className="mb-2"
            /> */}
          </div>
        </div>
      </div>

      {/* Invoice Body */}
      <div className="p-8 bg-white">
        {/* Billing Info */}
        <div className="grid grid-cols-2 gap-12 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Billed To
            </h2>
            <div className="text-gray-600">
              <p className="font-medium">{userDetails?.username || 'N/A'}</p>
              <p>{userDetails?.email || 'N/A'}</p>
              <p>Contact: {userDetails?.contact || 'N/A'}</p>
              {userDetails?.lable && (
                <p>Label Name: {userDetails.lable}</p>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Invoice Details
            </h2>
            <div className="text-gray-600">
              <p>
                Invoice Date:{" "}
                {new Date(subscription.startDate).toLocaleDateString()}
              </p>
              <p>Payment Method: Online via Razorpay</p>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="border rounded-lg overflow-hidden mb-8">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan Details
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {subscription.planName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Subscription Plan
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm text-gray-900">
                      Track Count: {subscription.trackCount}
                    </p>
                    <p className="text-sm text-gray-500">
                      Valid until{" "}
                      {new Date(subscription.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  ₹{priceCalculations.basePrice}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={2} className="px-6 py-4 text-right font-medium">
                  Subtotal
                </td>
                <td className="px-6 py-4 text-right font-medium">
                  ₹{priceCalculations.basePrice}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="px-6 py-4 text-right font-medium">
                  GST (18%)
                </td>
                <td className="px-6 py-4 text-right font-medium">
                  ₹{priceCalculations.gstAmount}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td colSpan={2} className="px-6 py-4 text-right font-bold">
                  Total (Inc. GST)
                </td>
                <td className="px-6 py-4 text-right font-bold">
                  ₹{priceCalculations.total}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment Info */}
        <div className="border-t pt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Payment Information
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Order ID:</span>{" "}
                {subscription.orderId}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">GST Number:</span>{" "}
                09CIXPJ5843F1ZN
              </p>
            </div>
          </div>
        </div>

        {/* Tax Note */}
        <div className="mt-8 text-sm text-gray-500 border-t pt-4">
          <p>
            Note: This invoice includes 18% GST as per Indian tax regulations.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Thank You | Keep Creating Magic</p>
          <p className="mt-1">
            If you have any questions, please contact our support team.
          </p>
          <p className="mt-1">
            Phone:{" "}
            <a href="tel:+91011889628163" className="text-blue-600 hover:underline">
              +91 011-889628163
            </a>
          </p>
          <p className="mt-1">
            <a
              href="https://swalay.talantoncore.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              swalay.talantoncore.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}; 