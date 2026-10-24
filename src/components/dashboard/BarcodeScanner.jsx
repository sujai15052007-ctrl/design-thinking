import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function inferCategory(product) {
  const labels = `${product.categories || ''} ${(product.categories_tags || []).join(' ')}`.toLowerCase();
  if (/dairy|milk|yogurt|cheese/.test(labels)) return 'Dairy';
  if (/bakery|bread|cereal|grain/.test(labels)) return 'Bakery';
  if (/meat|fish|seafood|protein/.test(labels)) return 'Proteins';
  if (/prepared|meal|ready-to-eat/.test(labels)) return 'Prepared Meals';
  if (/fruit|vegetable|produce/.test(labels)) return 'Produce';
  return 'Pantry';
}

export default function BarcodeScanner({ onProduct, onClose }) {
  const [error, setError] = useState('');
  const [lookingUp, setLookingUp] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reroot-barcode-reader',
      { fps: 8, qrbox: { width: 230, height: 180 }, rememberLastUsedCamera: true },
      false,
    );
    let active = true;
    let lookupPending = false;
    scanner.render(async (barcode) => {
      if (!active || lookupPending) return;
      lookupPending = true;
      setLookingUp(true);
      setError('');
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`);
        if (!response.ok) throw new Error('The product lookup service is unavailable.');
        const result = await response.json();
        const product = result.product;
        if (result.status !== 1 || !product) throw new Error('No product was found for that barcode. Enter the item manually.');
        onProduct({
          name: product.product_name || product.product_name_en || '',
          category: inferCategory(product),
          barcode,
        });
        onClose();
      } catch (lookupError) {
        setError(lookupError.message);
      } finally {
        lookupPending = false;
        setLookingUp(false);
      }
    }, () => {});

    return () => {
      active = false;
      scanner.clear().catch((clearError) => {
        console.warn('Could not stop the barcode scanner cleanly:', clearError);
      });
    };
  }, [onProduct, onClose]);

  return (
    <div style={{ padding: 'var(--space-4)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)' }}>
      <div id="reroot-barcode-reader" />
      {lookingUp && <p role="status">Looking up product…</p>}
      {error && <p role="alert" style={{ color: 'var(--color-danger)' }}>{error}</p>}
      <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Close scanner and enter manually</button>
    </div>
  );
}
