import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
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
    // verificar se localstorage possue o valor de carrinho armazenado
    // se nao retorna vetor vazio
    const storagedCart = localStorage.getItem('@RocketShoes:cart');
    if (storagedCart) {
      const cart_ = JSON.parse(storagedCart);
      return cart_;
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const updateCart: Product[] = [...cart];
      const produtoExist = updateCart.find(produto => produto.id === productId);

      if (!produtoExist) {
        const produto = (await api.get(`/products/${productId}`)).data;
        const estoqueProduto = (await api.get<Stock>(`/stock/${productId}`)).data;

        if (produto.amount > estoqueProduto) {
          toast.warn("Quantidade solicitada fora de estoque");
          return;
        }
        produto.amount = 1;
        setCart([...updateCart, produto]);
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(updateCart));
      } else {
        updateProductAmount({ productId, amount: (produtoExist.amount + 1) });
      }

    } catch {
      toast.error("Erro na adição do produto");

    }
  };

  const removeProduct = (productId: number) => {
    try {
      const produto = cart.find(produto => produto.id === productId);

      if (produto) {
        updateProductAmount({ productId, amount: (produto.amount - 1) });
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
        toast.warn("Quantidade solicitada fora de estoque");
        return;
      }

      if (estoques.amount < amount) {
        toast.warn("Quantidade solicitada fora de estoque");

        return;
      }
      //fonte https://cheatcode.co/tutorials/how-to-modify-an-existing-object-in-a-javascript-array
      const updateCart: Product[] = [...cart];

      const produto = updateCart.find(produto => produto.id === productId);
      //Verifica se existe um produto com o id no cart
      if (produto) {
        produto.amount = amount;
        setCart(updateCart);
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(updateCart));

      }
    } catch {
      toast.error("Erro na adição do produto");
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
