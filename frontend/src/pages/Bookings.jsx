{/* Documents */}
<div>
  <label className="text-sm text-gray-500 block mb-3">
    Uploaded Documents
  </label>

  <div className="grid grid-cols-3 gap-3">
    <button
      onClick={() => handleViewDocument(selectedBooking.id, "aadhar")}
      className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50 hover:text-primary-700 transition-all"
    >
      <FiDownload className="w-6 h-6 mx-auto mb-2" />
      <span className="text-sm font-medium">Aadhar Card</span>
    </button>

    <button
      onClick={() =>
        handleViewDocument(selectedBooking.id, "electricityBill")
      }
      className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50 hover:text-primary-700 transition-all"
    >
      <FiDownload className="w-6 h-6 mx-auto mb-2" />
      <span className="text-sm font-medium">Electricity Bill</span>
    </button>

    <button
      onClick={() =>
        handleViewDocument(selectedBooking.id, "bankPassbook")
      }
      className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50 hover:text-primary-700 transition-all"
    >
      <FiDownload className="w-6 h-6 mx-auto mb-2" />
      <span className="text-sm font-medium">Bank Passbook</span>
    </button>
  </div>
</div>
