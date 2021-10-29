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
  cartItemsAmount: CartItemsAmount;
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {

  const [cartItemsAmount, setCartItemsAmount] = useState<CartItemsAmount>(() => {

    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      const itemsAmount = JSON.parse(storagedCart).reduce((sumAmount: { [x: string]: number; }, product: { id: string | number; }) => {
        sumAmount[product.id] = sumAmount[product.id] + 1 || 0;
        return sumAmount;
      }, {} as CartItemsAmount);
      return itemsAmount;
    }
    return [];
  });

  const [cart, setCart] = useState<Product[]>(() => {

    const storagedCart = localStorage.getItem('@RocketShoes:cart');
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));

    const itemsAmount = cart.reduce((sumAmount, product) => {
      sumAmount[product.id] = Number(sumAmount[product.id]) + 1 || 1;
      return sumAmount;
    }, {} as CartItemsAmount);
    setCartItemsAmount(itemsAmount);
    // console.log(cartItemsAmount);
  }, [cart]);


  const addProduct = async (productId: number) => {
    try {
      const productExist = (await api.get(`/products/${productId}`)).data;
      if (productExist) {
        const estoques = (await api.get<Stock>(`/stock/${productId}`)).data;
        if ((estoques.amount) <= 0) {
          const notify = () => toast("Quantidade solicitada fora de estoque");
          notify();
          return;
        }
        const produto = cart.find(x => x.id === productId);

        if (!produto) {
          Object.assign(productExist, { amount: 1 });
          const updateCart = [...cart, productExist];

          setCart(updateCart);

        } else {
          if (estoques.amount > produto.amount) {
            const amount = produto.amount + 1 || 1;
            Object.assign(produto, { amount });
            setCart([...cart, produto]);
          }
          const notify = () => toast("Quantidade solicitada fora de estoque");
          notify();
        }

      } else {
        const notify = () => toast("Erro na alteração de quantidade do produto");
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
      value={{ cart, cartItemsAmount, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
