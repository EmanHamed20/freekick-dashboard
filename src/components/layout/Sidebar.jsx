// src/components/layout/Sidebar/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    MapPin,
    Landmark,
    PlusCircle,
    Layers,
    Trophy,
    Ticket,
    Image,
    Bell,
    DollarSign,
    FileText,
    CreditCard,
    Users,
    UserCheck,
    FileEdit,
    HeadphonesIcon,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/logo.svg';
import ScrollArea from '../common/ScrollArea.jsx';

const Sidebar = ({onToggle}) => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [tooltip, setTooltip] = useState({ show: false, label: '', top: 0 });
    const handleToggle = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        // Notify parent component about the state change
        if (onToggle) {
            onToggle(newState);
        }
    };
    const menuItems = [
        {
            title: 'Dashboard',
            items: [
                { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
            ]
        },
        {
            title: 'SALES CONTROL',
            items: [
                { icon: Calendar, label: 'Booking', path: '/bookings' },
                { icon: Calendar, label: 'Calendar', path: '/calendar' },
                { icon: MapPin, label: 'Venues', path: '/venues' },
                { icon: Landmark, label: 'Pitches', path: '/pitches' },
                { icon: PlusCircle, label: 'Amenities', path: '/amenities' },
                { icon: Layers, label: 'Add-ons', path: '/add-ons' },
                { icon: Layers, label: 'Categories', path: '/categories' },
                { icon: Trophy, label: 'Tournaments', path: '/tournaments' },
                { icon: Ticket, label: 'Tickets', path: '/tickets' },
            ]
        },
        {
            title: 'Display',
            items: [
                { icon: Image, label: 'Banners / Ads', path: '/banners' },
                { icon: Bell, label: 'Apps Notification', path: '/notifications' },
            ]
        },
        {
            title: 'Finance',
            items: [
                { icon: DollarSign, label: 'Revenue Overview', path: '/revenue' },
                { icon: FileText, label: 'Reports', path: '/reports' },
                { icon: CreditCard, label: 'Vouchers', path: '/vouchers' },
            ]
        },
        {
            title: 'Users Control',
            items: [
                { icon: Users, label: 'Players', path: '/players' },
                { icon: UserCheck, label: 'Pitch owners', path: '/pitch-owners' },
                { icon: FileEdit, label: 'Venues edit requests', path: '/venue-requests' },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: HeadphonesIcon, label: 'Support', path: '/support' },
            ]
        }
    ];

    const isActive = (path) => location.pathname === path;

    const handleMouseEnter = (e, label) => {
        if (!isCollapsed) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            show: true,
            label: label,
            top: rect.top + rect.height / 2
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ show: false, label: '', top: 0 });
    };

    return (
        <>
            <aside
                className={`bg-white h-screen fixed left-0 top-0 border-r border-gray-200 transition-all duration-300 z-50 flex flex-col ${
                    isCollapsed ? 'w-16' : 'w-56'
                }`}
            >
                {/* Logo Section with Toggle */}
                <div className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'justify-between px-5'} h-20 border-b border-gray-100 flex-shrink-0`}>
                    <div className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="FreeKick Logo"
                            className="w-10 h-10 object-contain flex-shrink-0"
                        />
                        {!isCollapsed && (
                            <span className="font-bold text-xl text-gray-800 whitespace-nowrap">FreeKick</span>
                        )}
                    </div>

                    {/* Toggle Button */}
                    {!isCollapsed && (
                        <button
                            onClick={handleToggle}  // Use handleToggle
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>

                {/* Navigation with custom scrollbar */}
                <ScrollArea className="flex-1" >
                    <nav dir={'ltr'} className={`py-4 ${isCollapsed ? 'px-2' : 'px-3'}`}>
                        {menuItems.map((section, index) => (
                            <div key={index} className="mb-6 last:mb-0">
                                {/* Section Title - Only show when not collapsed and if there's a title */}
                                {!isCollapsed && section.title && (
                                    <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3 truncate">
                                        {section.title}
                                    </h3>
                                )}

                                {/* Section divider when collapsed */}
                                {isCollapsed && index > 0 && (
                                    <div className="border-t border-gray-200 my-3 mx-2"></div>
                                )}

                                <ul className="space-y-1">
                                    {section.items.map((item, itemIndex) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.path);

                                        return (
                                            <li key={itemIndex}>
                                                <Link
                                                    to={item.path}
                                                    onMouseEnter={(e) => handleMouseEnter(e, item.label)}
                                                    onMouseLeave={handleMouseLeave}
                                                    className={`flex items-center gap-3 text-sm rounded-lg transition-all ${
                                                        active
                                                            ? 'bg-primary-700 text-white shadow-sm'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    } ${isCollapsed ? 'justify-center px-3 py-3' : 'px-3 py-2.5'}`}
                                                >
                                                    <Icon
                                                        className={`w-5 h-5  text-sm flex-shrink-0 transition-colors ${
                                                            active ? 'text-white' : 'text-gray-500'
                                                        }`}
                                                    />
                                                    {!isCollapsed && (
                                                        <span className={`text-xs transition-colors truncate ${
                                                            active ? 'text-white' : 'text-gray-700'
                                                        }`}>
                                                            {item.label}
                                                        </span>
                                                    )}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </ScrollArea>

                {/* Collapsed toggle button at bottom */}
                {isCollapsed && (
                    <div className="p-3 border-t border-gray-100 flex-shrink-0">
                        <button
                            onClick={handleToggle}  // Use handleToggle
                            className="w-full p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex justify-center"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                )}
            </aside>

            {/* Tooltip - Rendered OUTSIDE sidebar to avoid overflow clipping */}
            {tooltip.show && (
                <div
                    className="fixed pointer-events-none z-[100] transition-opacity duration-200"
                    style={{
                        left: isCollapsed ? '4rem' : '16.25rem',
                        top: `${tooltip.top}px`,
                        transform: 'translateY(-50%)'
                    }}
                >
                    <div className="relative">
                        <div className="px-3 py-2 bg-primary-700 text-white text-xs font-medium rounded-md whitespace-nowrap shadow-lg">
                            {tooltip.label}
                        </div>
                        {/* Arrow pointing left */}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-1px] w-2 h-2 bg-primary-700 rotate-45"></div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;