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
      return JSON.parse(storagedCart);
    }

    return [];
  });
  useEffect(() => { 
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
  }, [cart])


  const addProduct = async (productId: number) => {
    try {
      const productExist = (await api.get(`/products/${productId}`)).data;
      if (productExist) {

        const estoques = (await api.get<Stock>(`/stock/${productId}`)).data;
        if ((estoques.amount ) <= 0) {
          const notify = () => toast("Wow so easy!");
          notify();
          return;
        }

        const produto = cart.find(x => x.id === productId);
       /* if (!produto) {
          estoques
        }*/
        const updateCart = [...cart, productExist];
          setCart(updateCart);
      } else {
        const notify = () => toast("Wow so easy!");
        notify();
      }
    } catch {
      const notify = () => toast("Erro na adição do produto");
      notify();
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
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
