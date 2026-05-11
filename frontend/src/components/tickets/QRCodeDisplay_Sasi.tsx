import React, { useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Calendar, Hash } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';
import { formatDateTime } from '../../utils/formatDate_Sasi';

interface QRCodeDisplayProps {
  ticketNumber: string;
  eventName: string;
  date: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  ticketNumber,
  eventName,
  date,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `ticket-${ticketNumber}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [ticketNumber]);

  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Ticket header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-4 text-white">
        <p className="text-xs font-medium uppercase tracking-wider opacity-80">
          Event Ticket
        </p>
        <h3 className="mt-1 line-clamp-2 text-lg font-bold">{eventName}</h3>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center px-6 py-6">
        <div
          ref={canvasRef}
          className="rounded-xl border-2 border-dashed border-gray-200 p-4"
        >
          <QRCodeCanvas
            value={ticketNumber}
            size={180}
            bgColor="#ffffff"
            fgColor="#1f2937"
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Ticket info */}
        <div className="mt-4 w-full space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Hash className="h-4 w-4 shrink-0" />
            <span className="font-mono font-medium text-gray-900">
              {ticketNumber}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{formatDateTime(date)}</span>
          </div>
        </div>
      </div>

      {/* Perforated divider */}
      <div className="relative">
        <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-gray-100" />
        <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-gray-100" />
        <div className="border-t border-dashed border-gray-200" />
      </div>

      {/* Download */}
      <div className="px-6 py-4">
        <button
          type="button"
          onClick={handleDownload}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          <Download className="h-4 w-4" />
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
