import ProductRow from './ProductRow.jsx';

export default function ProductTable({ products, onDelete, onSave, notify }) {
  return (
    <div className="table-wrap">
      <table className="products-table">
        <thead>
          <tr>
            <th className="col-name">Продукт</th>
            <th className="col-num">Цена</th>
            <th className="col-num">Кол-во</th>
            <th className="col-num">Сумма</th>
            <th className="col-actions" />
          </tr>
        </thead>

        <tbody id="productList">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onDelete={onDelete}
              onSave={onSave}
              notify={notify}
            />
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <div className="empty-hint">
          <div className="terminal">
            <svg className="icon"><use href="#i-terminal" /></svg>
            <span>
              Добавь первый продукт<span className="cursor">_</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}