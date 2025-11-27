// src/components/common/ScrollArea.jsx
import React from 'react';

const ScrollArea = ({ children, className = '' }) => {
    return (
        <div  className={`overflow-hidden ${className}`}>
            <div dir={'rtl'} className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
                {children}
            </div>
        </div>
    );
};

export default ScrollArea;