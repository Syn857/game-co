import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Printer } from 'lucide-react';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export default function QRCodeDisplay({ url, size = 200 }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 2,
        color: {
          dark: '#2C5282',
          light: '#FFFFFF'
        }
      });
    }
  }, [url, size]);

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'farewell-game-qr.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const printQR = () => {
    if (canvasRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Farewell Game QR Code</title></head>
            <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
              <div style="text-align: center;">
                <h2 style="color: #2C5282; margin-bottom: 20px;">Circuit Overseer Farewell Game</h2>
                <img src="${canvasRef.current.toDataURL()}" alt="QR Code" style="border: 2px solid #2C5282; border-radius: 8px;" />
                <p style="margin-top: 20px; color: #4A5568;">Scan to join the game!</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="p-4 bg-white rounded-lg shadow-lg border-2 border-blue-600">
        <canvas ref={canvasRef} className="block" />
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={downloadQR}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={16} />
          <span>Download</span>
        </button>
        
        <button
          onClick={printQR}
          className="flex items-center space-x-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
        >
          <Printer size={16} />
          <span>Print</span>
        </button>
      </div>
      
      <p className="text-sm text-gray-600 text-center max-w-xs">
        Share this QR code for easy access to the farewell game
      </p>
    </div>
  );
}