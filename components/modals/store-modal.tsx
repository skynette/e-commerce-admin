'use client'

import React from 'react'
import { Modal } from '@/components/ui/modal'
import { useStoreModal } from '@/hooks/use-store-model'

const StoreModal = () => {
    const storeModal = useStoreModal()

    return (
        <Modal
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
            title="Create store"
            description="Add a new store to manage products and categories"
        >
            Futiure Create store form
        </Modal>
    )
}

export default StoreModal