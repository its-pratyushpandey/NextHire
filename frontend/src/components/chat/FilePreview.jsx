import React from 'react';

export default function FilePreview({ file, onRemove }) {
  if (!file) return null;
  const isImage = file.type.startsWith('image/');
  const isGif = file.type === 'image/gif';
  const isPdf = file.type === 'application/pdf';
  const isDoc = file.type.includes('word') || file.type.includes('officedocument');

  return (
    <div className="flex items-center gap-2 p-2 border rounded bg-gray-50 dark:bg-gray-800 mt-2">
      {isImage && (
        <img src={URL.createObjectURL(file)} alt={file.name} className="w-16 h-16 object-cover rounded" />
      )}
      {isPdf && (
        <span className="text-red-600 font-bold">PDF: {file.name}</span>
      )}
      {isDoc && (
        <span className="text-blue-600 font-bold">DOC: {file.name}</span>
      )}
      {!isImage && !isPdf && !isDoc && (
        <span className="text-gray-700 dark:text-gray-200">{file.name}</span>
      )}
      <button onClick={onRemove} className="ml-auto text-xs text-red-500 hover:underline">Remove</button>
    </div>
  );
}
