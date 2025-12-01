// FILE LOCATION: src/components/ImageUpload.jsx

import React, { useState } from 'react';
import { Upload, X, Loader2, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { uploadService } from '../services/uploadService';
import { generateUniqueFileName } from '../utils/fileUtils';

const ImageUpload = ({
                         value = null, // Current image URL
                         onChange, // Callback with uploaded URL
                         onRemove, // Callback when image is removed
                         disabled = false,
                         maxSize = 5, // Max size in MB
                         aspectRatio = 'square', // 'square', 'wide', 'tall', or custom
                         className = '',
                         label = 'Event Image',
                         required = false,
                         showUploadButton = true, // Show separate upload button or auto-upload
                         autoUpload = false, // Automatically upload when file is selected
                     }) => {
    const [preview, setPreview] = useState(value);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState(value);

    // Calculate aspect ratio class
    const getAspectClass = () => {
        switch (aspectRatio) {
            case 'square': return 'aspect-square';
            case 'wide': return 'aspect-video';
            case 'tall': return 'aspect-[3/4]';
            default: return aspectRatio;
        }
    };

    // Handle file selection
    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            toast.error(`Image size must be less than ${maxSize}MB`);
            return;
        }

        setSelectedFile(file);

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Auto-upload if enabled
        if (autoUpload) {
            await uploadFile(file);
        }
    };

    // Upload file to server
    const uploadFile = async (file = selectedFile) => {
        if (!file) {
            toast.error('Please select an image first');
            return;
        }

        try {
            setUploading(true);
            const uniqueName = generateUniqueFileName(file.name);
            const result = await uploadService.processFullUpload(file, uniqueName);

            setUploadedUrl(result.url);
            onChange?.(result.url);

            toast.success('Image uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload image');
            console.error('Upload error:', error);
            handleRemove();
        } finally {
            setUploading(false);
        }
    };

    // Remove image
    const handleRemove = () => {
        setPreview(null);
        setSelectedFile(null);
        setUploadedUrl(null);
        onChange?.(null);
        onRemove?.();
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="flex flex-col md:flex-row gap-6">
                {/* Preview Area */}
                <div className="flex-shrink-0">
                    {preview ? (
                        <div className="relative group">
                            <img
                                src={preview}
                                alt="Preview"
                                className={`w-48 h-48 ${getAspectClass()} object-cover rounded-lg border-2 border-gray-200`}
                            />
                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={disabled || uploading}
                                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50"
                            >
                                <X size={16} />
                            </button>

                            {/* Upload Status Badge */}
                            {uploadedUrl && (
                                <div className="absolute bottom-2 left-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                                    <Check size={12} />
                                    Uploaded
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={`w-48 h-48 ${getAspectClass()} bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center`}>
                            <Upload size={40} className="text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">No image selected</p>
                        </div>
                    )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap gap-3">
                        {/* Choose File Button */}
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                disabled={disabled || uploading}
                                className="hidden"
                                id="image-file-input"
                            />
                            <label
                                htmlFor="image-file-input"
                                className={`inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors font-medium ${
                                    (disabled || uploading) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <Upload size={18} />
                                Choose Image
                            </label>
                        </div>

                        {/* Upload Button (if not auto-upload) */}
                        {showUploadButton && !autoUpload && selectedFile && !uploadedUrl && (
                            <button
                                type="button"
                                onClick={() => uploadFile()}
                                disabled={disabled || uploading}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium disabled:opacity-50"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        Upload to Server
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Upload Status */}
                    {uploading && (
                        <div className="flex items-center gap-2 text-blue-600">
                            <Loader2 size={16} className="animate-spin" />
                            <span className="text-sm font-medium">Uploading...</span>
                        </div>
                    )}

                    {uploadedUrl && !uploading && (
                        <div className="flex items-center gap-2 text-green-600">
                            <Check size={16} />
                            <span className="text-sm font-medium">Image uploaded successfully</span>
                        </div>
                    )}

                    {/* Helper Text */}
                    <p className="text-xs text-gray-500">
                        Supported formats: PNG, JPG, JPEG. Max size: {maxSize}MB
                    </p>

                    {/* File Info */}
                    {selectedFile && (
                        <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                            <p className="font-medium">{selectedFile.name}</p>
                            <p className="text-gray-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;