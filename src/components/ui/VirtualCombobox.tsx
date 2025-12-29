import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import type { Ingredient } from '../../types/api-responses';
import ImageWithLoader from './ImageWithLoader';

interface VirtualComboboxProps {
    items: Ingredient[];
    selectedItem: string;
    onSelect: (item: string, description?: string) => void;
    loading: boolean;
    placeholder?: string;
}

const VirtualCombobox: React.FC<VirtualComboboxProps> = ({
    items,
    selectedItem,
    onSelect,
    loading,
    placeholder = "Search..."
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const deferredValue = useDeferredValue(searchTerm);

    useEffect(() => {
        if (!open && selectedItem) {
            setSearchTerm(selectedItem);
        }
    }, [selectedItem, open]);

    const filteredItems = useMemo(() => {
        if (!deferredValue) return items;
        return items
            .filter(item => item.name.toLowerCase().includes(deferredValue.toLowerCase()));
    }, [deferredValue, items]);

    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: filteredItems.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 88,
        overscan: 5,
    });

    return (
        <div className="w-full relative">
            <input
                onFocus={() => setOpen(true)}
                onBlur={() => {
                    setOpen(false)
                }}
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setOpen(true);
                }}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all"
            />

            {open && filteredItems.length > 0 && (
                <div
                    ref={parentRef}
                    onMouseDown={(e) => e.preventDefault()}
                    className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-2 shadow-2xl max-h-60 overflow-y-auto"
                >
                    <div
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const item = filteredItems[virtualRow.index];
                            return (
                                <div
                                    key={item.id}
                                    data-index={virtualRow.index}
                                    onClick={() => {
                                        onSelect(item.name, item.description || undefined);
                                        setSearchTerm(item.name);
                                        setOpen(false);
                                    }}
                                    className="p-3 hover:bg-orange-50 cursor-pointer border-b last:border-0 absolute top-0 left-0 w-full h-[88px] overflow-hidden flex items-start gap-3"
                                    style={{
                                        transform: `translateY(${virtualRow.start}px)`,
                                        height: '88px',
                                    }}
                                >
                                    <div className="w-12 h-12 flex-shrink-0 mt-1">
                                        <ImageWithLoader
                                            src={`https://www.themealdb.com/images/ingredients/${item.name.replace(/ /g, '_')}-small.png`}
                                            alt={item.name}
                                            containerClassName="w-full h-full rounded"
                                            imageClassName="w-full h-full object-contain"
                                        />
                                    </div >
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-800">{item.name}</div>
                                        {item.description && (
                                            <p className="text-sm text-gray-500 line-clamp-2 leading-snug">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </div >
                            );
                        })}
                    </div >
                </div >
            )}

            {loading && !open && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    Loading...
                </div>
            )}
        </div >
    );
};

export default VirtualCombobox;
