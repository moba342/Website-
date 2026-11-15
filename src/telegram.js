const TELEGRAM_URL = 'https://t.me/Eljh_Miller';
const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
export function telegramOrderUrl(items) {
  const lines = items.map(p => {
    const quantity = Number.isInteger(Number(p.qty)) && Number(p.qty) > 0 ? Number(p.qty) : 1;
    const price = p.price == null ? 'Price: please provide a quote' : `Listed unit price: ${money(p.price)} USD\nItem total: ${money(p.price * quantity)} USD`;
    return `${p.name}\nQuantity: ${quantity}\n${price}`;
  });
  const message = ['Hello, I would like to order from CloudsSupply.store.', ...lines, 'Please confirm current price, availability, and delivery.'].join('\n\n');
  return `${TELEGRAM_URL}?text=${encodeURIComponent(message.slice(0, 3500))}`;
}
