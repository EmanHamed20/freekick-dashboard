// src/App.jsx
import { Provider, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './store/store';
import './i18n/i18n.js';
import 'react-toastify/dist/ReactToastify.css';
import AppContent from "./AppContent.jsx";

// Separate component to access Redux state
function ToastWrapper() {
    const { direction } = useSelector((state) => state.language);

    return (
        <ToastContainer
            position={direction === 'rtl' ? 'top-left' : 'top-right'}
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={direction === 'rtl'}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            limit={3}
        />
    );
}

function App() {
    return (
        <Provider store={store}>
            <AppContent />
            <ToastWrapper />
        </Provider>
    );
}

export default App;