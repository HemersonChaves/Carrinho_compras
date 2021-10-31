import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  /*const cartFormatted = cart.map(product => ({
    formatPrice(product.price)
   })) */
const total = formatPrice(
  cart.reduce((sumTotal, product) => {
    return sumTotal + product.price;    
  }, 0)
)

function handleProductIncrement(product: Product) {
  // TODO
}

function handleProductDecrement(product: Product) {
  // TODO
}

function handleRemoveProduct(productId: number) {
  // TODO
}

return (
  <Container>
    <ProductTable>
      <thead>
        <tr>
          <th aria-label="product image" />
          <th>PRODUTO</th>
          <th>QTD</th>
          <th>SUBTOTAL</th>
          <th aria-label="delete icon" />
        </tr>
      </thead>
      <tbody>
        {cart.map((produto) => {
          return <tr data-testid="product" key={produto.id}>
            <td>
              <img src={produto.image} alt={produto.title} />
            </td>
            <td>
              <strong>{produto.title}</strong>
              <span>{formatPrice(produto.price)}</span>
            </td>
            <td>
              <div>
                <button
                  type="button"
                  data-testid="decrement-product"
                // disabled={product.amount <= 1}
                // onClick={() => handleProductDecrement()}
                >
                  <MdRemoveCircleOutline size={20} />
                </button>
                <input
                  type="text"
                  data-testid="product-amount"
                  readOnly
                  value={produto.amount}
                />
                <button
                  type="button"
                  data-testid="increment-product"
                // onClick={() => handleProductIncrement()}
                >
                  <MdAddCircleOutline size={20} />
                </button>
              </div>
            </td>
            <td>
              <strong>{formatPrice(produto.amount * produto.price)}</strong>
            </td>
            <td>
              <button
                type="button"
                data-testid="remove-product"
              // onClick={() => handleRemoveProduct(product.id)}
              >
                <MdDelete size={20} />
              </button>
            </td>
          </tr>
        })}
      </tbody>
    </ProductTable>

    <footer>
      <button type="button">Finalizar pedido</button>

      <Total>
        <span>TOTAL</span>
        <strong>{total}</strong>
      </Total>
    </footer>
  </Container>
);
};

export default Cart;
