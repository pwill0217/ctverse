import React, { useState } from 'react';

type AddModalProps = {
  isOpen: boolean;
  catalog: { id: string; name: string; image: string }[];
  onClose: () => void;
  onAdd: (newItem: {
    name: string;
    image: string;
    purchasePrice: number;
    purchaseDate: string;
    condition: string;
    notes?: string;
  }) => void;
};

const AddModal: React.FC<AddModalProps> = ({ isOpen, catalog, onClose, onAdd }) => {
  const [selectedProduct, setSelectedProduct] = useState(catalog[0]);
  const [price, setPrice] = useState<number>(0);
  const [purchaseDate, setPurchaseDate] = useState<string>('');
  const [condition, setCondition] = useState<string>('new');
  const [notes, setNotes] = useState<string>('');

  const handleAdd = () => {
    if (!selectedProduct || !price || !purchaseDate || !condition) {
      alert('Please fill in all fields');
      return;
    }

    onAdd({
      name: selectedProduct.name,
      image: selectedProduct.image,
      purchasePrice: price,
      purchaseDate,
      condition,
      notes,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Item</h2>

        {/* Product Selector */}
        <div className="mb-4">
          <label htmlFor="product" className="block text-sm font-medium text-gray-700">
            Select Product
          </label>
          <select
            id="product"
            value={selectedProduct.id}
            onChange={(e) =>
              setSelectedProduct(catalog.find((product) => product.id === e.target.value)!)
            }
            className="mt-1 p-2 w-full border rounded-md"
          >
            {catalog.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Input */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Purchase Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        {/* Purchase Date Input */}
        <div className="mb-4">
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
            Purchase Date
          </label>
          <input
            type="date"
            id="purchaseDate"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        {/* Condition Selector */}
        <div className="mb-4">
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
            Condition
          </label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          >
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="damaged">Damaged</option>
          </select>
        </div>

        {/* Notes Input */}
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Item
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;