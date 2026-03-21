import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

type Props = {
  value: string;
};

const QRCodeDisplay: React.FC<Props> = ({ value }) => {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6">
      <QRCodeCanvas value={value} size={180} includeMargin />
      <div className="text-xs text-gray-500">Present this QR code at check-in</div>
    </div>
  );
};

export default QRCodeDisplay;

