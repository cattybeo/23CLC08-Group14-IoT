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
import { products as initialProducts } from "@/data/mockData";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

const getStatusBadge = (quantity, maxStock) => {
  if (quantity === 0) {
    return { label: "Out of Stock", variant: "destructive" };
  }
  if (quantity < maxStock * 0.2) {
    return { label: "Low Stock", variant: "warning" };
  }
  return { label: "In Stock", variant: "success" };
};

const generateProdId = () => {
  const num = Math.floor(Math.random() * 900) + 100;
  return `PROD-${num}`;
};

const ProductsTable = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMaxStock, setEditMaxStock] = useState("");
  
  // Create dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newMaxStock, setNewMaxStock] = useState("");

  // Sort by modifiedAt descending (newest first)
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => 
      new Date(b.modifiedAt) - new Date(a.modifiedAt)
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return sortedProducts;
    
    const query = searchQuery.toLowerCase();
    return sortedProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.prod_id.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
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
    setEditName(product.name);
    setEditMaxStock(product.maxStock.toString());
    setEditDialogOpen(true);
  };

  const handleEditSubmit = () => {
    if (!editName.trim() || !editMaxStock) return;
    
    setProducts(prev => prev.map(p => 
      p.id === editingProduct.id 
        ? { 
            ...p, 
            name: editName.trim(), 
            maxStock: parseInt(editMaxStock), 
            modifiedAt: new Date().toISOString() 
          }
        : p
    ));
    setEditDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = () => {
    setProducts(prev => prev.filter(p => p.id !== editingProduct.id));
    setEditDialogOpen(false);
    setEditingProduct(null);
  };

  // Create handlers
  const openCreateDialog = () => {
    setNewName("");
    setNewQuantity("");
    setNewMaxStock("");
    setCreateDialogOpen(true);
  };

  const handleQuantityChange = (value) => {
    setNewQuantity(value);
    if (!newMaxStock && value) {
      setNewMaxStock(value);
    }
  };

  const handleCreateSubmit = () => {
    if (!newName.trim() || !newQuantity) return;
    
    const newProduct = {
      id: Date.now(),
      prod_id: generateProdId(),
      name: newName.trim(),
      description: "New product",
      quantity: parseInt(newQuantity),
      maxStock: parseInt(newMaxStock) || parseInt(newQuantity),
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    };
    
    setProducts(prev => [newProduct, ...prev]);
    setCreateDialogOpen(false);
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
          Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} items
        </div>
        
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[120px]">Product ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => {
                const status = getStatusBadge(product.quantity, product.maxStock);
                
                return (
                  <TableRow
                    key={product.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {product.prod_id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {product.quantity}
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
                        onClick={() => openEditDialog(product)}
                        className="gap-1 border-success text-success bg-success/10 hover:bg-success/20 rounded-full"
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
            disabled={currentPage === 1}
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
            disabled={currentPage === totalPages}
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
                <Label htmlFor="edit-prod-id">Product ID</Label>
                <div className="font-mono text-sm bg-muted px-3 py-2 rounded border">
                  {editingProduct.prod_id}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-muted/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-quantity">Quantity (Read-only)</Label>
                <Input
                  id="edit-quantity"
                  value={editingProduct.quantity}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-maxstock">In Stock (Max Stock)</Label>
                <Input
                  id="edit-maxstock"
                  type="number"
                  value={editMaxStock}
                  onChange={(e) => setEditMaxStock(e.target.value)}
                  className="bg-muted/50"
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
              Delete
            </Button>
            <Button 
              variant="outline"
              onClick={handleEditSubmit}
              className="border-primary text-primary bg-primary/10 hover:bg-primary/20 rounded-full"
            >
              Submit
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
              <Label htmlFor="new-name">Product Name</Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter product name"
                className="bg-muted/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-quantity">Quantity</Label>
              <Input
                id="new-quantity"
                type="number"
                value={newQuantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                placeholder="Enter quantity"
                className="bg-muted/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-maxstock">In Stock (Max Stock)</Label>
              <Input
                id="new-maxstock"
                type="number"
                value={newMaxStock}
                onChange={(e) => setNewMaxStock(e.target.value)}
                placeholder="Auto-fills from quantity"
                className="bg-muted/50"
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
    </Card>
  );
};

export default ProductsTable;