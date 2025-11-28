import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

/**
 * Sortable Table Header Component
 *
 * @param {string} label - The display label for the header
 * @param {string} sortKey - The key used for sorting (e.g., 'name', 'id', 'status')
 * @param {string} currentSortKey - The currently active sort key
 * @param {string} currentSortOrder - The current sort order ('asc' or 'desc')
 * @param {function} onSort - Callback function when header is clicked
 * @param {string} align - Text alignment ('left', 'center', 'right')
 */
const SortableTableHeader = ({
                                 label,
                                 sortKey,
                                 currentSortKey,
                                 currentSortOrder,
                                 onSort,
                                 align = 'left'
                             }) => {
    const isActive = currentSortKey === sortKey;

    const handleClick = () => {
        if (onSort) {
            onSort(sortKey);
        }
    };

    const alignmentClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end'
    };

    const getSortIcon = () => {
        if (!isActive) {
            return <ChevronsUpDown size={16} className="text-gray-400" />;
        }

        if (currentSortOrder === 'asc') {
            return <ChevronUp size={16} className="text-teal-600" />;
        }

        return <ChevronDown size={16} className="text-teal-600" />;
    };

    return (
        <th
            className={`px-6 py-3 text-${align} text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors`}
            onClick={handleClick}
        >
            <div className={`flex items-center gap-2 ${alignmentClasses[align]}`}>
                <span className={isActive ? 'text-teal-600 font-semibold' : ''}>
                    {label}
                </span>
                {getSortIcon()}
            </div>
        </th>
    );
};

export default SortableTableHeader;