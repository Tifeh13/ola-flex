import { useRef, useState } from 'react';
import { Upload, X, Star, ImageIcon } from 'lucide-react';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

export default function ImageUpload({ images = [], onAdd, onRemove, onSetPrimary, maxImages = 10 }) {
  const widgetRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const openUpload = () => {
    if (!window.cloudinary) {
      alert('Image upload is loading. Please try again in a moment.');
      return;
    }

    setUploading(true);
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        multiple: true,
        maxFiles: maxImages - images.length,
        maxImageFileSize: 5000000,
        acceptedFiles: 'image/jpeg,image/png,image/webp',
        sources: ['local', 'camera', 'url'],
        theme: 'minimal',
        styles: {
          palette: {
            window: '#1a1a1a',
            windowBorder: '#333',
            tabIcon: '#d4a843',
            menuIcons: '#d4a843',
            textDark: '#ffffff',
            textLight: '#999',
            link: '#d4a843',
            activeTab: '#222',
            inactiveTab: '#111',
          },
        },
      },
      (error, result) => {
        if (error) {
          console.error('Upload error:', error);
          setUploading(false);
          return;
        }
        if (result && result.event === 'success') {
          onAdd(result.info.secure_url);
        }
        if (result && result.event === 'close') {
          setUploading(false);
        }
      }
    );

    widget.open();
  };

  const remaining = maxImages - images.length;

  return (
    <div>
      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-4">
          {images.map((img, i) => {
            const url = typeof img === 'string' ? img : img.image_url;
            const isPrimary = typeof img === 'object' ? img.is_primary === 1 : i === 0;
            const imgId = typeof img === 'object' ? img.id : i;

            return (
              <div key={imgId} className="relative aspect-square border border-border overflow-hidden group bg-surface-alt">
                <img src={url} alt="" className="w-full h-full object-cover" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/50 transition-all duration-200 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                  {onSetPrimary && !isPrimary && (
                    <button
                      type="button"
                      onClick={() => onSetPrimary(imgId)}
                      className="p-1.5 bg-ink/70 hover:bg-brand-500 transition-colors rounded"
                      title="Set as primary"
                    >
                      <Star size={12} className="text-white" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemove(imgId)}
                    className="p-1.5 bg-ink/70 hover:bg-status-out transition-colors rounded"
                    title="Remove image"
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>

                {/* Primary badge */}
                {isPrimary && (
                  <div className="absolute top-1.5 left-1.5">
                    <div className="bg-brand-500 text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 flex items-center gap-0.5">
                      <Star size={8} fill="currentColor" /> Primary
                    </div>
                  </div>
                )}

                {/* Image number */}
                <div className="absolute bottom-1.5 right-1.5 bg-ink/60 text-white text-[9px] font-medium w-5 h-5 flex items-center justify-center rounded-full">
                  {i + 1}
                </div>
              </div>
            );
          })}

          {/* Add more slot */}
          {images.length < maxImages && (
            <button
              type="button"
              onClick={openUpload}
              className="aspect-square border-2 border-dashed border-border hover:border-brand-400 flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer group"
            >
              <Upload size={16} className="text-ink-faint group-hover:text-brand-500 transition-colors" />
              <span className="text-[9px] text-ink-faint group-hover:text-brand-500 transition-colors">Add</span>
            </button>
          )}
        </div>
      )}

      {/* Upload button (when no images) */}
      {images.length === 0 && (
        <button
          type="button"
          onClick={openUpload}
          className="w-full aspect-[2/1] border-2 border-dashed border-border hover:border-brand-400 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-full bg-surface-alt group-hover:bg-brand-50 flex items-center justify-center transition-colors">
            <ImageIcon size={24} className="text-ink-faint group-hover:text-brand-500 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm text-ink-secondary group-hover:text-brand-600 transition-colors font-medium">
              {uploading ? 'Uploading...' : 'Click to upload images'}
            </p>
            <p className="text-[11px] text-ink-faint mt-1">
              JPEG, PNG, or WebP · Max 5MB each · Up to {maxImages} images
            </p>
          </div>
        </button>
      )}

      {/* Image counter */}
      {images.length > 0 && (
        <div className="flex items-center justify-between mt-2">
          <p className="text-[11px] text-ink-faint">
            {images.length} of {maxImages} images
            {remaining > 0 && ` · ${remaining} more can be added`}
          </p>
          {images.length < maxImages && images.length > 0 && (
            <button
              type="button"
              onClick={openUpload}
              className="text-[11px] text-brand-500 hover:text-brand-600 transition-colors font-medium"
            >
              + Add more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
