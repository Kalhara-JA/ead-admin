import InventoryPage from '@/components/inventory/inventoryTable'
import React from 'react'
import { Toaster } from 'react-hot-toast'

function Inventory() {
  return (
    <div>
      <Toaster />
      <InventoryPage />
    </div>
  )
}

export default Inventory