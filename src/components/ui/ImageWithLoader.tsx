import { Utensils } from 'lucide-react';
import { useState } from 'react';

interface ImageWithLoaderProps {
    src: string;
    alt: string;
    containerClassName?: string;
    imageClassName?: string;
    previewSrc?: string;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
    src,
    alt,
    containerClassName = "",
    imageClassName = "w-full h-full object-cover",
    previewSrc
}) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden bg-gray-100 ${containerClassName}`}>
            {!loaded && !previewSrc && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <Utensils className="w-1/3 h-1/3 max-w-12 max-h-12" />
                </div>
            )}

            {/* Preview Image (Low Quality) - Visible immediately if provided */}
            {/* Preview Image (Low Quality) - Stays visible behind main image to prevent opacity dip */}
            {previewSrc && (
                <img
                    src={previewSrc}
                    alt={alt}
                    className={`${imageClassName} absolute inset-0 blur-xl scale-105`}
                    aria-hidden="true"
                />
            )}

            {/* Main Image (High Quality) - Fades in cleanly on top */}
            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                className={`relative transition-opacity duration-700 ease-in-out ${imageClassName} ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
};

export default ImageWithLoader;
