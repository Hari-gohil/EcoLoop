import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import UserService from '../services/userService';

const QRCodeCard = ({ upiId }) => {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQR = async () => {
      if (!upiId) {
        setLoading(false);
        return;
      }
      try {
        const data = await UserService.getQRCode();
        setQrImage(data.qrCode);
      } catch (error) {
        console.error('Failed to load QR code', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQR();
  }, [upiId]);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Your Payment QR Code</h3>
      
      {loading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Loading QR Code...</p>
      ) : upiId ? (
        qrImage ? (
          <div>
            <img 
              src={qrImage} 
              alt="UPI QR Code" 
              style={{ width: '200px', height: '200px', borderRadius: 'var(--radius-sm)', border: '2px solid white' }} 
            />
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              UPI ID: {upiId}
            </p>
          </div>
        ) : (
          <p className="error-text">Failed to load QR image.</p>
        )
      ) : (
        <div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            You haven't added a UPI ID yet. Add one to receive payments for your waste!
          </p>
        </div>
      )}
    </div>
  );
};

export default QRCodeCard;
