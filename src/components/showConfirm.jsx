// src/utils/showConfirm.js
import Swal from 'sweetalert2';

export const showConfirm = async ({
                                      title = "Are you sure?",
                                      text = "You won't be able to revert this!",
                                      confirmButtonText = "Yes, delete it",
                                      cancelButtonText = "Cancel",
                                      icon = 'warning'
                                  } = {}) => {

    const result = await Swal.fire({
        title: title,
        text: text,
        icon: icon,

        // 1. Layout & Behavior
        showCancelButton: true,
        reverseButtons: true, // Cancel on left, Confirm on right
        focusCancel: true,
        width: '26rem', // Compact and modern width

        // 2. Theming (Colors & Icons)
        iconColor: '#ef4444', // Modern Tailwind Red-500 for warnings
        background: '#ffffff',
        backdrop: `rgba(0,0,0,0.4)`, // Dimmer smooth backdrop

        // 3. Disable default SweetAlert buttons so we can use Tailwind
        buttonsStyling: false,

        // 4. Custom Tailwind Classes (The "Great Design" part)
        customClass: {
            container: 'font-sans', // Ensure it matches your app font
            popup: 'rounded-2xl shadow-2xl p-6 border border-gray-100', // Rounded & detailed
            title: 'text-xl font-bold text-gray-800 mb-2',
            htmlContainer: 'text-gray-500 text-sm mb-6', // Lighter, smaller text

            // Styled Cancel Button (Ghost/Outline style)
            cancelButton: `
                px-5 py-2.5 mr-3 
                bg-white text-gray-700 font-medium text-sm
                rounded-lg border border-gray-300 
                hover:bg-gray-50 hover:text-gray-900 
                focus:ring-4 focus:ring-gray-100 
                transition-all duration-200 ease-in-out
            `,

            // Styled Confirm Button (Vibrant Red with shadow)
            confirmButton: `
                px-5 py-2.5 
                bg-red-600 text-white font-medium text-sm
                rounded-lg shadow-md hover:shadow-lg
                hover:bg-red-700 
                focus:ring-4 focus:ring-red-200 
                transition-all duration-200 ease-in-out
            `
        },

        // 5. Animations (Smooth Entry/Exit)
        showClass: {
            popup: 'animate__animated animate__fadeInUp animate__faster' // Slides up slightly
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutDown animate__faster'
        }
    });

    return result.isConfirmed;
};