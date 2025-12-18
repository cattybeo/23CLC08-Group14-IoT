import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Plus, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/use-products";
import { productService } from "@/services/product.service";

const ITEMS_PER_PAGE = 4;

const getStatusBadge = (quantity, initStock) => {
  if (quantity === 0) {
    return { label: "Out of Stock", variant: "destructive" };
  }
  if (quantity < initStock * 0.2) {
    return { label: "Low Stock", variant: "warning" };
  }
  return { label: "In Stock", variant: "success" };
};

const generateProdId = () => {
  const num = Math.floor(Math.random() * 900) + 100;
  return `PROD-${num}`;
};

const ProductsTable = () => {
  const { data: products = [], isLoading, refetch } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editSku, setEditSku] = useState("");
  const [editName, setEditName] = useState("");
  const [editRfid, setEditRfid] = useState("");
  const [editCurrentStock, setEditCurrentStock] = useState("");
  const [editInitStock, setEditInitStock] = useState("");

  // Create dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newRfid, setNewRfid] = useState("");
  const [newLowStockThreshold, setNewLowStockThreshold] = useState("");

  // Add stock dialog state
  const [addStockDialogOpen, setAddStockDialogOpen] = useState(false);
  const [addingProduct, setAddingProduct] = useState(null);
  const [addStockQuantity, setAddStockQuantity] = useState("");

  // Sort by modified_at descending (newest first)
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) =>
      new Date(b.modified_at || b.created_at) - new Date(a.modified_at || a.created_at)
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return sortedProducts;

    const query = searchQuery.toLowerCase();
    return sortedProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
    );
  }, [searchQuery, sortedProducts]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Edit handlers
  const openEditDialog = (product) => {
    setEditingProduct(product);
    setEditSku(product.sku || "");
    setEditName(product.name);
    setEditRfid(product.rfid_uid || "");
    setEditCurrentStock(product.current_stock?.toString() || "");
    setEditInitStock(product.init_stock?.toString() || "");
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editSku.trim() || !editName.trim() || !editRfid.trim() || !editCurrentStock || !editInitStock) return;

    const newCurrentStock = parseInt(editCurrentStock);
    const newInitStock = parseInt(editInitStock);
    const updateData = {
      sku: editSku.trim(),
      name: editName.trim(),
      rfid_uid: editRfid.trim(),
      current_stock: newCurrentStock,
      init_stock: newInitStock,
    };

    // If init_stock < current_stock, update current_stock to match init_stock
    if (newInitStock < newCurrentStock) {
      updateData.current_stock = newInitStock;
    }

    try {
      const { data, error } = await productService.update(editingProduct.id, updateData);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Update successful:', data);
      refetch();
      setEditDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const { data, error } = await productService.remove(editingProduct.id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      console.log('Delete successful:', data);
      refetch();
      setEditDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Create handlers
  const openCreateDialog = () => {
    setNewName("");
    setNewQuantity("");
    setNewSku("");
    setNewRfid("");
    setNewLowStockThreshold("");
    setCreateDialogOpen(true);
  };

  // Add stock handlers
  const openAddStockDialog = (product) => {
    setAddingProduct(product);
    setAddStockQuantity("");
    setAddStockDialogOpen(true);
  };

  const handleAddStockSubmit = async () => {
    if (!addStockQuantity) return;

    const quantityToAdd = parseInt(addStockQuantity);
    const newCurrentStock = addingProduct.current_stock + quantityToAdd;
    const newInitStock = newCurrentStock;

    const updateData = {
      current_stock: newCurrentStock,
      init_stock: newInitStock,
      modified_at: new Date().toISOString()
    };

    try {
      const { data, error } = await productService.update(addingProduct.id, updateData);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Update successful:', data);
      refetch();
      setAddStockDialogOpen(false);
      setAddingProduct(null);
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  const handleCreateSubmit = async () => {
    if (!newName.trim() || !newQuantity || !newSku.trim()) return;

    const quantity = parseInt(newQuantity);
    const lowStockThreshold = newLowStockThreshold ? parseInt(newLowStockThreshold) : 0;
    const newProductData = {
      sku: newSku.trim(),
      name: newName.trim(),
      rfid_uid: newRfid.trim() || null,
      current_stock: quantity,
      init_stock: quantity,
      low_stock_threshold: lowStockThreshold,
    };

    try {
      const { data, error } = await productService.create(newProductData);

      if (error) {
        console.error('Supabase create error:', error);
        throw error;
      }

      console.log('Create successful:', data);
      refetch();
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <Card className="border-0 shadow-xs" id="products-section">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">All Products</CardTitle>
            <p className="text-sm text-muted-foreground">
              Full inventory list with real-time quantities
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search Product ID, product name..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-9 bg-background border-input"
            />
          </div>
        </div>
        <Button
          onClick={openCreateDialog}
          variant="outline"
          className="gap-2 w-fit ml-auto border-primary text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary rounded-full"
        >
          <Plus className="h-4 w-4" />
          Create Product
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-right text-sm text-muted-foreground">
          {filteredProducts.length > 0 ? (
            <>Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} items</>
          ) : (
            <>Showing 0 items</>
          )}
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[180px]">Product ID</TableHead>
                <TableHead className="w-[250px]">Product Name</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center w-[120px]">Action 1</TableHead>
                <TableHead className="text-center w-[120px]">Action 2</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => {
                const status = getStatusBadge(product.current_stock, product.init_stock);

                return (
                  <TableRow
                    key={product.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {product.sku}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{product.name}</p>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {product.current_stock}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          "font-medium",
                          status.variant === "success" && "bg-success/10 text-success hover:bg-success/20",
                          status.variant === "warning" && "bg-warning/10 text-warning hover:bg-warning/20",
                          status.variant === "destructive" && "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        )}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAddStockDialog(product)}
                        className="gap-1 border-success text-success bg-success/10 hover:bg-success/20 rounded-full"
                      >
                        <Plus className="h-4 w-4" />
                        Add Stock
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                        className="gap-1 border-border text-foreground bg-card hover:bg-muted/50 rounded-full"
                      >
                        <Pencil className="h-4 w-4" />
                        Modify
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || filteredProducts.length === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0 || filteredProducts.length === 0}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modify Product</DialogTitle>
            <DialogDescription>
              Edit product details or delete this product.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-sku">Product SKU</Label>
                <Input
                  id="edit-sku"
                  value={editSku}
                  onChange={(e) => setEditSku(e.target.value)}
                  className="bg-muted/50"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-muted/50"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-rfid">RFID</Label>
                <Input
                  id="edit-rfid"
                  value={editRfid}
                  onChange={(e) => setEditRfid(e.target.value)}
                  className="bg-muted/50"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-current-stock">Current Stock</Label>
                <Input
                  id="edit-current-stock"
                  type="number"
                  value={editCurrentStock}
                  onChange={(e) => setEditCurrentStock(e.target.value)}
                  className="bg-muted/50"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-initstock">Initial Stock</Label>
                <Input
                  id="edit-initstock"
                  type="number"
                  value={editInitStock}
                  onChange={(e) => setEditInitStock(e.target.value)}
                  className="bg-muted/50"
                  required
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleDelete}
              className="border-destructive text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-full"
            >
              DELETE PERMANENT
            </Button>
            <Button
              variant="outline"
              onClick={handleEditSubmit}
              className="border-primary text-primary bg-primary/10 hover:bg-primary/20 rounded-full"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-sku">Product SKU</Label>
              <Input
                id="new-sku"
                value={newSku}
                onChange={(e) => setNewSku(e.target.value)}
                placeholder="Enter SKU (e.g., PROD-001)"
                className="bg-muted/50"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-name">Product Name</Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter product name"
                className="bg-muted/50"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-rfid">RFID</Label>
              <Input
                id="new-rfid"
                value={newRfid}
                onChange={(e) => setNewRfid(e.target.value)}
                placeholder="Enter RFID tag"
                className="bg-muted/50"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-quantity">Initial Stock Quantity</Label>
              <Input
                id="new-quantity"
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="bg-muted/50"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-low-stock">Low Stock Threshold</Label>
              <Input
                id="new-low-stock"
                type="number"
                value={newLowStockThreshold}
                onChange={(e) => setNewLowStockThreshold(e.target.value)}
                placeholder="Enter threshold (default: 0)"
                className="bg-muted/50"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              className="border-muted-foreground text-muted-foreground bg-muted/50 hover:bg-muted rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleCreateSubmit}
              className="border-primary text-primary bg-primary/10 hover:bg-primary/20 rounded-full"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Stock Dialog */}
      <Dialog open={addStockDialogOpen} onOpenChange={setAddStockDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Stock</DialogTitle>
            <DialogDescription>
              Add more stock quantity to this product.
            </DialogDescription>
          </DialogHeader>
          {addingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="add-product-name">Product Name</Label>
                <Input
                  id="add-product-name"
                  value={addingProduct.name}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-quantity">Quantity to Add</Label>
                <Input
                  id="add-quantity"
                  type="number"
                  value={addStockQuantity}
                  onChange={(e) => setAddStockQuantity(e.target.value)}
                  placeholder="Enter quantity to add"
                  className="bg-muted/50"
                  required
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddStockDialogOpen(false)}
              className="border-border text-foreground bg-card hover:bg-muted/50 rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleAddStockSubmit}
              className="border-success text-success bg-success/10 hover:bg-success/20 rounded-full"
            >
              Add Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductsTable;