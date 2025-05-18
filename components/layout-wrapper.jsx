'use client';

import { useState, useEffect } from 'react';
import { RefreshModal } from '@/components/auth/refresh-modal';
import { Toaster } from "react-hot-toast";

export function LayoutWrapper({ children }) {
    const [showModal, setShowModal] = useState(false);
    const [modalCallbacks, setModalCallbacks] = useState(null);

    useEffect(() => {
        const handleShowRefreshModal = (event) => {
            setModalCallbacks(event.detail);
            setShowModal(true);
        };

        window.addEventListener('showRefreshModal', handleShowRefreshModal);
        return () => {
            window.removeEventListener('showRefreshModal', handleShowRefreshModal);
        };
    }, []);

    const handleClose = () => {
        setShowModal(false);
        if (modalCallbacks?.onClose) {
            modalCallbacks.onClose();
        }
    };

    const handleSuccess = (token) => {
        if (modalCallbacks?.onSuccess) {
            modalCallbacks.onSuccess(token);
        }
        setShowModal(false);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Toaster position="bottom-right"/>
            {children}
            <RefreshModal
                isOpen={showModal}
                onClose={handleClose}
                onSuccess={handleSuccess}
            />
        </div>
    );
}