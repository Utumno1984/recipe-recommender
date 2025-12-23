import { Utensils } from 'lucide-react';
import { useState } from 'react';

interface ImageWithLoaderProps {
    src: string;
    alt: string;
    containerClassName?: string;
    imageClassName?: string;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
    src,
    alt,
    containerClassName = "",
    imageClassName = "w-full h-full object-cover"
}) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden bg-gray-100 ${containerClassName}`}>
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <Utensils className="w-1/3 h-1/3 max-w-12 max-h-12" />
                </div>
            )}
            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                className={`transition-opacity duration-500 ${imageClassName} ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
};

export default ImageWithLoader;
