import { LLCFormData } from '../types';

interface OrderConfirmationProps {
  formData: LLCFormData;
  orderTotal: number;
  orderId: string;
  onSubmit: () => void;
  onPrev: () => void;
}

const OrderConfirmation = ({ formData, orderTotal, orderId, onSubmit, onPrev }: OrderConfirmationProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmation</h2>
        <p className="text-gray-600">Review your LLC formation details</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Company Name:</span>
            <span className="font-medium">{formData.companyName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Business Address:</span>
            <span className="font-medium">
              {formData.businessAddress}, {formData.businessCity}, {formData.businessZip}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Registered Agent:</span>
            <span className="font-medium">
              {formData.registeredAgent ? 'Yes (+$149)' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Compliance Service:</span>
            <span className="font-medium">
              {formData.compliance ? 'Yes (+$99)' : 'No'}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Next Steps</h4>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>We'll review your LLC name for availability (1-2 business days)</li>
          <li>Articles of Organization will be filed with the state</li>
          <li>You'll receive your EIN and documents via email</li>
        </ul>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onPrev}
          className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Submit Order
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
