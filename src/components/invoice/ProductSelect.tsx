
import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserBranch } from "@/hooks/useUserBranch";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { normalizeBranchName } from "@/lib/branch-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  store_price: number;
  category: string;
  lens_stock_id?: string;
}

interface LensStock {
  id: string;
  sph: number;
  cyl: number;
  quantity: number;
  lens_type_id: string;
  lens_type: {
    name: string;
    material: string;
    price?: number;
  };
}

interface ProductSelectProps {
  value: string;
  onChange: (value: string) => void;
  onProductSelect: (product: Product) => void;
  branch: string;
}

const CATEGORIES = ["Frame", "Lensa", "Soft Lens", "Sunglasses", "Others"];

const formatNumber = (num: number) => {
  const fixed = num.toFixed(2);
  return num > 0 ? `+${fixed}` : fixed;
};

export function ProductSelect({
  value,
  onChange,
  onProductSelect,
  branch: initialBranch,
}: ProductSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lensTypeFilter, setLensTypeFilter] = useState("");
  const [materialFilter, setMaterialFilter] = useState("");
  const [sphFilter, setSphFilter] = useState("");
  const [cylFilter, setCylFilter] = useState("");
  const [isCustomProduct, setIsCustomProduct] = useState(false);
  const [customProductName, setCustomProductName] = useState("");
  const [customProductCategory, setCustomProductCategory] = useState("Others");
  const [activeTab, setActiveTab] = useState("products");

  const queryClient = useQueryClient();

  const normalizedBranch = useMemo(() => {
    if (!initialBranch) return "";
    try {
      return normalizeBranchName(initialBranch);
    } catch (error) {
      console.error("Error normalizing branch:", error);
      return "";
    }
  }, [initialBranch]);

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("branch")
        .eq("id", user.id)
        .single();

      return profile;
    },
  });

  const { data: userBranch, isLoading: isLoadingBranch } = useUserBranch();

  const effectiveBranch = useMemo(() => {
    return initialBranch || userBranch || "";
  }, [initialBranch, userBranch]);

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
    error: productsError, // Add error handling
  } = useQuery({
    queryKey: ["products", effectiveBranch],
    queryFn: async () => {
      if (!effectiveBranch) {
        console.log("No branch available");
        return [];
      }

      const { data, error } = await supabase
        .from("products")
        .select("id, name, store_price, category, stock_qty, track_inventory")
        .eq("branch", effectiveBranch);

      if (error) throw error;
      console.log(
        `Fetched ${data?.length || 0} products for branch ${effectiveBranch}`,
      );
      return data || [];
    },
    enabled: !!effectiveBranch && open,
  });

  const { data: lensStock = [], isLoading: isLoadingLensStock } = useQuery({
    queryKey: ["lens-stock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lens_stock")
        .select(
          `
          id,
          sph,
          cyl,
          quantity,
          lens_type_id,
          lens_type:lens_type_id (
            name,
            material,
            price
          )
        `,
        )
        .gt("quantity", 0);

      if (error) throw error;
      return data || [];
    },
  });
  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

  const filteredLensStock = useMemo(() => {
    if (!Array.isArray(lensStock)) return [];

    return lensStock.filter((stock) => {
      const matchesLensType =
        !lensTypeFilter ||
        stock.lens_type?.name
          .toLowerCase()
          .includes(lensTypeFilter.toLowerCase());
      const matchesMaterial =
        !materialFilter ||
        stock.lens_type?.material
          .toLowerCase()
          .includes(materialFilter.toLowerCase());
      const matchesSph = !sphFilter || stock.sph === parseFloat(sphFilter);
      const matchesCyl = !cylFilter || stock.cyl === parseFloat(cylFilter);

      return matchesLensType && matchesMaterial && matchesSph && matchesCyl;
    });
  }, [lensStock, lensTypeFilter, materialFilter, sphFilter, cylFilter]);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === value),
    [products, value],
  );

  const handleProductSelect = async (product: Product) => {
    console.log("Selecting product for branch:", effectiveBranch);

    // Verify branch access before selection
    if (!effectiveBranch) {
      toast.error("No branch context available");
      return;
    }

    // Update selection
    onChange(product.id);
    onProductSelect(product);

    // Close dialog
    setOpen(false);

    // Invalidate queries
    await queryClient.invalidateQueries({ queryKey: ["products"] });

    // Force refresh products
    setTimeout(() => {
      refetchProducts();
    }, 100);
  };

  const handleLensStockSelect = async (stock: LensStock) => {
    try {
      console.log("=== Lens Stock Selection Debug ===");
      console.log("1. Selected stock item:", stock);

      if (!stock.lens_type_id) {
        toast.error("Invalid lens type selection");
        return;
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session?.user?.id) {
        toast.error("Authentication required");
        return;
      }

      const { data: lensType, error: lensTypeError } = await supabase
        .from("lens_types")
        .select("*")
        .eq("id", stock.lens_type_id)
        .single();

      if (lensTypeError) throw lensTypeError;
      if (!lensType) {
        toast.error("Lens type not found");
        return;
      }

      console.log("2. Found lens type:", lensType);

      const { data: existingProduct, error: queryError } = await supabase
        .from("products")
        .select("*")
        .eq("lens_type_id", stock.lens_type_id)
        .eq("lens_sph", stock.sph)
        .eq("lens_cyl", stock.cyl)
        .maybeSingle();

      let productId;
      const productName = `${lensType.name} ${lensType.material} SPH:${formatNumber(stock.sph)} CYL:${formatNumber(stock.cyl)}`;

      if (existingProduct) {
        console.log("3. Found existing product:", existingProduct);
        productId = existingProduct.id;
      } else {
        const { data: newProduct, error: insertError } = await supabase
          .from("products")
          .insert({
            name: productName,
            category: "Stock Lens",
            store_price: lensType.price || 0,
            lens_type_id: stock.lens_type_id,
            lens_sph: stock.sph,
            lens_cyl: stock.cyl,
            brand: lensType.material,
            user_id: session.user.id,
            published: true,
            track_inventory: false,
          })
          .select()
          .single();

        if (insertError) {
          console.error("Product creation error:", insertError);
          throw insertError;
        }
        console.log("3. Created new product:", newProduct);
        productId = newProduct.id;
      }

      const product = {
        id: productId,
        name: productName,
        store_price: lensType.price || 0,
        category: "Stock Lens",
        lens_stock_id: stock.id,
        lens_type_id: stock.lens_type_id,
        lens_sph: stock.sph,
        lens_cyl: stock.cyl,
      };

      console.log("4. Final product object:", product);

      handleProductSelect(product);
      toast.success("Lens stock selected successfully");
    } catch (error) {
      console.error("Error selecting lens stock:", error);
      toast.error("Failed to select lens stock");
    }
  };

  const handleCustomProductSubmit = async () => {
    if (customProductName.trim()) {
      try {
        const customProductId = generateUUID();
        const { data: userData } = await supabase.auth.getUser();

        if (!userData.user?.id) {
          toast.error("User not authenticated");
          return;
        }

        const fullBranchName = normalizeBranchName(effectiveBranch);
        console.log("Creating custom product for branch:", fullBranchName);

        const { error: insertError } = await supabase.from("products").insert({
          id: customProductId,
          name: customProductName,
          store_price: 0,
          category: customProductCategory,
          user_id: userData.user.id,
          branch: fullBranchName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error("Error creating custom product:", insertError);
          throw insertError;
        }

        const customProduct = {
          id: customProductId,
          name: customProductName,
          store_price: 0,
          category: customProductCategory,
          branch: fullBranchName,
        };

        await queryClient.invalidateQueries({ queryKey: ["products"] });
        handleProductSelect(customProduct);
        setCustomProductName("");
        setCustomProductCategory("Others");
        setIsCustomProduct(false);
        toast.success("Custom product created successfully");
      } catch (error) {
        console.error("Error creating custom product:", error);
        toast.error("Failed to create custom product");
      }
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setSearchQuery("");
      setLensTypeFilter("");
      setMaterialFilter("");
      setSphFilter("");
      setCylFilter("");
      setIsCustomProduct(false);
      setCustomProductName("");
      setCustomProductCategory("Others");
      setActiveTab("products");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  };

  const getDisplayName = () => {
    if (isLoadingBranch) return "Loading branch...";
    if (isLoadingProducts) return "Loading products...";
    if (!effectiveBranch) return "No branch selected";
    return selectedProduct?.name || "Select product...";
  };

  if (productsError) {
    return (
      <FormItem className="flex flex-col">
        <FormLabel>Product</FormLabel>
        <Button
          variant="outline"
          className="w-full justify-between text-destructive"
          type="button"
        >
          Error loading products
        </Button>
        <FormMessage>
          {productsError instanceof Error
            ? productsError.message
            : "Failed to load products"}
        </FormMessage>
      </FormItem>
    );
  }

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Product</FormLabel>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between bg-background",
                !value && "text-muted-foreground",
              )}
              disabled={isLoadingProducts}
              type="button"
            >
              {isLoadingProducts ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                getDisplayName()
              )}
            </Button>
          </FormControl>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Product</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isCustomProduct}
                  onCheckedChange={setIsCustomProduct}
                />
                <span className="text-sm">Custom Product</span>
              </div>
            </div>

            {isCustomProduct ? (
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Input
                    placeholder="Enter custom product name..."
                    value={customProductName}
                    onChange={(e) => setCustomProductName(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCustomProductSubmit();
                      }
                    }}
                  />
                  <Select
                    value={customProductCategory}
                    onValueChange={setCustomProductCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  onClick={handleCustomProductSubmit}
                  disabled={!customProductName.trim()}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Product
                </Button>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="lens-stock">Lens Stock</TabsTrigger>
                </TabsList>

                <TabsContent value="products">
                  <div className="flex items-center space-x-2 sticky top-0 bg-background p-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <ScrollArea className="h-[50vh]">
                    {filteredProducts.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No products found.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {filteredProducts.map((product) => (
                          <Button
                            key={product.id}
                            type="button"
                            variant="ghost"
                            className={cn(
                              "justify-start font-normal py-6 px-4 hover:bg-accent hover:text-accent-foreground",
                              value === product.id && "bg-accent",
                            )}
                            onClick={() => handleProductSelect(product)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === product.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <div className="flex flex-col items-start">
                              <span className="font-medium">
                                {product.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Category: {product.category}
                              </span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="lens-stock">
                  <div className="space-y-4 sticky top-0 bg-background p-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Lens Type..."
                        value={lensTypeFilter}
                        onChange={(e) => setLensTypeFilter(e.target.value)}
                      />
                      <Input
                        placeholder="Material..."
                        value={materialFilter}
                        onChange={(e) => setMaterialFilter(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="SPH (e.g. -2.00)"
                        value={sphFilter}
                        onChange={(e) => setSphFilter(e.target.value)}
                        type="number"
                        step="0.25"
                      />
                      <Input
                        placeholder="CYL (e.g. -0.50)"
                        value={cylFilter}
                        onChange={(e) => setCylFilter(e.target.value)}
                        type="number"
                        step="0.25"
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-[50vh]">
                    {isLoadingLensStock ? (
                      <div className="py-6 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground mt-2">
                          Loading lens stock...
                        </p>
                      </div>
                    ) : filteredLensStock.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No lens stock found.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {filteredLensStock.map((stock) => (
                          <Button
                            key={stock.id}
                            type="button"
                            variant="ghost"
                            className="justify-start font-normal py-6 px-4 hover:bg-accent hover:text-accent-foreground"
                            onClick={() => handleLensStockSelect(stock)}
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-medium">
                                {stock.lens_type?.name}{" "}
                                {stock.lens_type?.material}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                SPH: {formatNumber(stock.sph)} | CYL:{" "}
                                {formatNumber(stock.cyl)} | Stock:{" "}
                                {stock.quantity}
                              </span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <FormMessage />
    </FormItem>
  );
}
