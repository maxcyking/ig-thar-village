"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Product, getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/database";
import { uploadMultipleImages } from "@/lib/storage";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Package,
  Milk,
  Wheat,
  Leaf
} from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const categoryIcons = {
  dairy: Milk,
  grains: Wheat,
  vegetables: Leaf,
  spices: Leaf,
  handicrafts: Package,
  other: Package
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const categories = [
    { value: "all", label: "All" },
    { value: "dairy", label: "Dairy" },
    { value: "grains", label: "Grains" },
    { value: "vegetables", label: "Vegetables" },
    { value: "spices", label: "Spices" },
    { value: "handicrafts", label: "Handicrafts" },
    { value: "other", label: "Other" }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const allProducts = await getProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        await fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product. Please try again.");
      }
    }
  };

  const handleSaveProduct = async (productData: any) => {
    setSaving(true);
    try {
      let imageUrls: string[] = [];
      
      if (productData.image) {
        imageUrls = await uploadMultipleImages([productData.image], 'products');
      }

      // Remove the image field and create clean product data
      const { image, stock, ...cleanProductData } = productData;
      
      const productToSave = {
        ...cleanProductData,
        images: imageUrls,
        inStock: stock > 0,
        shortDescription: productData.description.substring(0, 100)
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productToSave);
      } else {
        await createProduct(productToSave);
      }

      await fetchProducts();
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Products</h1>
          <p className="text-muted-foreground">
            Manage your organic products and inventory
          </p>
        </div>
        <Button onClick={handleAddProduct} className="rounded-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="rounded-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="rounded-lg"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const IconComponent = categoryIcons[product.category as keyof typeof categoryIcons] || Package;
            return (
              <Card key={product.id} className="rounded-lg hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1 capitalize">
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge 
                      variant={product.inStock ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium">₹{product.price}/{product.unit}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-medium capitalize">{product.category}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 rounded-lg"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="rounded-lg text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredProducts.length === 0 && (
        <Card className="rounded-lg">
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first product"
              }
            </p>
            {!searchTerm && selectedCategory === "all" && (
              <Button onClick={handleAddProduct} className="rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Product Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}