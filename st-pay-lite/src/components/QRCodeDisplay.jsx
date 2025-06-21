const QRCodeDisplay = ({ value, size = 200 }) => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
      value
    )}`;
  
    return (
      <div className="text-center">
        <img
          src={qrCodeUrl}
          alt="QR Code"
          className="mx-auto mb-2 border-2 border-gray-300 rounded"
          width={size}
          height={size}
        />
        <p className="text-sm text-gray-600">Scan with your phone to book tickets</p>
      </div>
    );
  };
  
  export default QRCodeDisplay;