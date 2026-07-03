import { useDispatch, useSelector } from "react-redux";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  incrementQuantity as incrementQuantityAction,
  decrementQuantity as decrementQuantityAction,
  clearCart as clearCartAction,
  selectCartItems,
  selectCartTotalItems,
  selectCartSubtotal,
  CartItem,
} from "@/store/slices/cart.slice";
import { toast } from "sonner";

export const useCart = () => {
  const dispatch = useDispatch();

  const items = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const subtotal = useSelector(selectCartSubtotal);

  const addToCart = (item: CartItem) => {
    dispatch(addToCartAction(item));
    toast.success(`${item.title} has been added to your cart.`);
  };

  const removeFromCart = (posterId: string) => {
    const item = items.find((i) => i.posterId === posterId);
    dispatch(removeFromCartAction(posterId));
    toast.success(`${item?.title} has been removed from your cart.`);
  };

  const updateQuantity = (posterId: string, quantity: number) => {
    dispatch(updateQuantityAction({ posterId, quantity }));
  };

  const incrementQuantity = (posterId: string) => {
    const item = items.find((i) => i.posterId === posterId);
    if (item && item.quantity >= item.stock) {
      toast.error(`Cannot add more of ${item.title}. Stock limit reached.`);
      return;
    }
    dispatch(incrementQuantityAction(posterId));
  };

  const decrementQuantity = (posterId: string) => {
    dispatch(decrementQuantityAction(posterId));
  };

  const clearCart = () => {
    dispatch(clearCartAction());
    toast.success("Cart has been cleared.");
  };

  const isInCart = (posterId: string) => {
    return items.some((item) => item.posterId === posterId);
  };

  const getItemQuantity = (posterId: string) => {
    const item = items.find((i) => i.posterId === posterId);
    return item?.quantity || 0;
  };

  return {
    items,
    totalItems,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };
};
