'use client';
export default function ConfirmDialog({ open, title='Confermi?', description='', confirmText='Conferma', cancelText='Annulla', onConfirm, onCancel }) {
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && <p className="text-gray-300 mb-4">{description}</p>}
        <div className="flex justify-end gap-3">
          <button className="bg-gray-600 hover:bg-gray-500" onClick={onCancel}>{cancelText}</button>
          <button className="bg-red-600 hover:bg-red-700" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
