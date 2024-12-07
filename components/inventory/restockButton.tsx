import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, RefreshCcw } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InventoryItem } from '@/types/inventoryTypes';
import { Label } from '@/components/ui/label';

interface RestockModalProps {
  item: InventoryItem;
  onRestock: (item: InventoryItem, quantity: number) => Promise<void>;
  isLoading: boolean;
}

export function RestockModal({ item, onRestock, isLoading }: RestockModalProps) {
  const [quantity, setQuantity] = useState<string>('100');

  const handleRestock = async () => {
    const restockQuantity = parseInt(quantity, 10);
    if (restockQuantity > 0) {
      await onRestock(item, restockQuantity);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Restock
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restock {item.sku}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="col-span-3"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Current Stock: {item.currentStock}
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleRestock} 
            disabled={isLoading || parseInt(quantity, 10) <= 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Restocking...
              </>
            ) : (
              "Restock"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}