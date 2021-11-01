import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}
interface CartItemsAmount {
  [key: number]: number;
}
interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {

  const [cart, setCart] = useState<Product[]>(() => {

    const storagedCart = localStorage.getItem('@RocketShoes:cart');
    if (storagedCart) {
      const cart_ = JSON.parse(storagedCart);
      
      return cart_;
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const produto = cart.find(produto => produto.id === productId);

      if (!produto) {
        const produto = (await api.get(`/products/${productId}`)).data;
        Object.assign(produto, { amount: 1 });
        const updateCart: Product[] = [...cart, produto];
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(updateCart));

        // setCartItemsAmount(updateCart.map(item => ({ item.id: 2, item.amount }), {} as CartItemsAmount));

        setCart(updateCart);

      } else {
        updateProductAmount({ productId, amount: (produto.amount + 1) });
      }

   

    } catch {
      const notify = () => toast.error("Erro na adição do produto");
      notify();
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const produto = cart.find(produto => produto.id === productId);

      if (produto) {
        updateProductAmount({ productId, amount: (produto.amount -1) });

      }
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const estoques = (await api.get<Stock>(`/stock/${productId}`)).data;

      if ((estoques.amount) <= 0) {
        const notify = () => toast.warn("Quantidade solicitada fora de estoque");
        notify();
        return;
      }

      if (estoques.amount < amount) {
        const notify = () => toast.warn("Quantidade solicitada fora de estoque");
        notify();
        return;
      }

      const produto = cart.find(produto => produto.id === productId);
      if (produto) {
        Object.assign(produto, { amount: amount });   
        const updateCart: Product[] = cart;
        Object.assign(updateCart, { produto });
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(updateCart));
        setCart(updateCart);
      }
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
