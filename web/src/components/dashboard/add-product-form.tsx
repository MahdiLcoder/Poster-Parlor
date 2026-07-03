"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useCreateInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useGetInventoryItemByIdQuery,
} from "@/store/api/inventory.api";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Loader2, ArrowLeft } from "lucide-react";

interface ImagePreview {
  file?: File;
  preview: string;
  isExisting?: boolean;
  public_id?: string;
}

interface FormData {
  title: string;
  description: string;
  price: string;
  dimensions: string;
  material: string;
  stock: string;
  category: string;
  isAvailable: boolean;
  tags: string[];
}

const CATEGORIES = [
  "Abstract",
  "Anime",
  "Cartoon",
  "Floral",
  "Grunge",
  "Landscapes",
  "Minimalist",
  "Motivational",
  "Music",
  "Nature",
  "Retro",
  "Sports",
  "Typography",
  "Vintage",
];

const MATERIALS = ["Premium Paper", "Canvas", "Matte Paper", "Glossy Paper"];

const DIMENSIONS = ["12x18", "18x24", "24x36", "16x20", "20x30"];

export function AddProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  // API hooks
  const [createInventoryItem, { isLoading: isCreating }] =
    useCreateInventoryItemMutation();
  const [updateInventoryItem, { isLoading: isUpdating }] =
    useUpdateInventoryItemMutation();

  // Fetch existing product if in edit mode
  const {
    data: existingProduct,
    isLoading: isLoadingProduct,
    isError: isProductError,
  } = useGetInventoryItemByIdQuery(editId!, { skip: !editId });

  const isSubmitting = isCreating || isUpdating;

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    dimensions: "",
    material: "",
    stock: "",
    category: "",
    isAvailable: true,
    tags: [],
  });

  const [images, setImages] = useState<ImagePreview[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && existingProduct?.data) {
      const poster = existingProduct.data;
      setFormData({
        title: poster.title || "",
        description: poster.description || "",
        price: poster.price?.toString() || "",
        dimensions: poster.dimensions || "",
        material: (poster as any).material || "",
        stock: poster.stock?.toString() || "",
        category: poster.category || "",
        isAvailable: poster.isAvailable ?? true,
        tags: poster.tags || [],
      });

      // Set existing images
      if (poster.images && poster.images.length > 0) {
        setImages(
          poster.images.map((img) => ({
            preview: img.url,
            isExisting: true,
            public_id: img.public_id,
          }))
        );
      }
    }
  }, [isEditMode, existingProduct]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 5 - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newPreviews = filesToAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isExisting: false,
    }));

    setImages((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];

    // If it's an existing image, add to removal list
    if (imageToRemove.isExisting && imageToRemove.public_id) {
      setImagesToRemove((prev) => [...prev, imageToRemove.public_id!]);
    }

    // If it's a new image, revoke the object URL
    if (!imageToRemove.isExisting && imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    setImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.category) {
      toast.error("Category is required");
      return;
    }
    if (!formData.dimensions) {
      toast.error("Dimensions are required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      toast.error("Valid stock quantity is required");
      return;
    }
    if (images.length === 0) {
      toast.error("At least one image is required");
      return;
    }
    if (formData.tags.length === 0) {
      toast.error("At least one tag is required");
      return;
    }

    try {
      if (isEditMode && editId) {
        // Update existing product
        const newImages = images
          .filter((img) => !img.isExisting && img.file)
          .map((img) => img.file!);

        const updateDetails: any = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          dimensions: formData.dimensions,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          isAvailable: formData.isAvailable,
          tags: formData.tags,
        };

        if (formData.material) {
          updateDetails.material = formData.material;
        }

        if (imagesToRemove.length > 0) {
          updateDetails.imagesToDelete = imagesToRemove;
        }

        await updateInventoryItem({
          id: editId,
          images: newImages,
          updateDetails,
        }).unwrap();

        toast.success("Product updated successfully!");
        router.push("/dashboard/products");
      } else {
        // Create new product
        const itemDetails = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          dimensions: formData.dimensions,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          isAvailable: formData.isAvailable,
          tags: formData.tags,
          material: formData.material,
        };

        await createInventoryItem({
          images: images.filter((img) => img.file).map((img) => img.file!),
          itemDetails,
        }).unwrap();

        toast.success("Product added successfully!");

        // Reset form
        setFormData({
          title: "",
          description: "",
          price: "",
          dimensions: "",
          material: "",
          stock: "",
          category: "",
          isAvailable: true,
          tags: [],
        });
        setImages([]);
        setTagInput("");
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        `Failed to ${isEditMode ? "update" : "add"} product. Please try again.`;
      toast.error(errorMessage);
    }
  };

  const handleDiscard = () => {
    if (
      window.confirm(
        "Are you sure you want to discard all changes? This action cannot be undone."
      )
    ) {
      router.push("/dashboard/products");
    }
  };

  // Loading state for edit mode
  if (isEditMode && isLoadingProduct) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state for edit mode
  if (isEditMode && isProductError) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive">Failed to load product</p>
          <Button onClick={() => router.push("/dashboard/products")}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard/products")}
                className="p-2 hover:bg-muted rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold">
                {isEditMode ? "Edit Product" : "Add Product"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleDiscard}>
                Discard
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} size="sm">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditMode ? "Updating..." : "Publishing..."}
                  </>
                ) : isEditMode ? (
                  "Update Product"
                ) : (
                  "Publish Product"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two Column Layout: Left and Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Details Card */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">Product Details</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">
                      Name *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category *
                      </Label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full mt-2 px-3 py-2 border rounded-md text-sm bg-background text-foreground border-input focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&>option]:bg-background [&>option]:text-foreground"
                      >
                        <option value="">Select category</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label
                        htmlFor="dimensions"
                        className="text-sm font-medium"
                      >
                        Dimensions *
                      </Label>
                      <select
                        id="dimensions"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                        className="w-full mt-2 px-3 py-2 border rounded-md text-sm bg-background text-foreground border-input focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&>option]:bg-background [&>option]:text-foreground"
                      >
                        <option value="">Select dimensions</option>
                        {DIMENSIONS.map((dim) => (
                          <option key={dim} value={dim}>
                            {dim}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="material" className="text-sm font-medium">
                      Material
                    </Label>
                    <select
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className="w-full mt-2 px-3 py-2 border rounded-md text-sm bg-background text-foreground border-input focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&>option]:bg-background [&>option]:text-foreground"
                    >
                      <option value="">Select material</option>
                      {MATERIALS.map((mat) => (
                        <option key={mat} value={mat}>
                          {mat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description (Optional)
                    </Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Set a description to the product for better visibility."
                      rows={4}
                      className="w-full mt-2 px-3 py-2 border rounded-md text-sm bg-background text-foreground border-input focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </Card>

              {/* Images Card */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">Product Images</h2>
                <div className="space-y-4">
                  <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={images.length >= 5}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">
                        Drag and drop images or click to select
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Max 5 images
                      </p>
                      {images.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {images.length}/5 selected
                        </p>
                      )}
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded border"
                          />
                          {img.isExisting && (
                            <Badge
                              variant="secondary"
                              className="absolute top-2 left-2 text-xs"
                            >
                              Existing
                            </Badge>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded"
                          >
                            <X className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Tags Card */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">Tags *</h2>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Add a tag"
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">Pricing</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium">
                      Base Price (₹) *
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock" className="text-sm font-medium">
                      Stock Quantity *
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="mt-2"
                    />
                  </div>

                  <label className="flex items-center space-x-3 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded accent-primary"
                    />
                    <span className="text-sm font-medium">
                      Available for sale
                    </span>
                  </label>
                </div>
              </Card>

              {/* Info Card */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Tips</h2>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Use high-quality images (at least 800x800px)</li>
                  <li>• Add relevant tags to improve searchability</li>
                  <li>• Keep product names clear and descriptive</li>
                  <li>• Set accurate stock quantities</li>
                </ul>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
