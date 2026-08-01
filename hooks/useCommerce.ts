'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  activeCoupons,
  activePromotions,
  calculateBoostCost,
  calculateOrder,
  cartCount,
  cartSubtotal,
  enabledGatewayProviders,
  providersForMethod,
  validateCoupon,
} from '@/lib/commerce';
import { COMMERCE_PORTFOLIO, BOOST_PREVIEWS } from '@/constants/placeholder-commerce';
import type {
  CommerceCart,
  CommerceCoupon,
  CommercePaymentMethod,
  CommerceProduct,
  CommerceProductType,
} from '@/types/commerce';

export default function useCommerce() {
  const [carts, setCarts] = useState<CommerceCart[]>(COMMERCE_PORTFOLIO.carts);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | CommerceProductType>('all');
  const [selectedCartId, setSelectedCartId] = useState<string | undefined>(carts[0]?.id);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMMERCE_PORTFOLIO.products.filter((product) => {
      const matchesCategory = category === 'all' || product.type === category;
      const matchesQuery =
        q.length === 0 ||
        product.name.toLowerCase().includes(q) ||
        product.summary.toLowerCase().includes(q) ||
        product.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const updateCart = useCallback((cartId: string, update: (cart: CommerceCart) => CommerceCart) => {
    setCarts((current) => current.map((cart) => (cart.id === cartId ? update(cart) : cart)));
  }, []);

  const addToCart = useCallback(
    (cartId: string, product: CommerceProduct, quantity = 1) => {
      updateCart(cartId, (cart) => {
        const existing = cart.items.find((item) => item.productId === product.id);
        const items = existing
          ? cart.items.map((item) =>
              item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item,
            )
          : [
              ...cart.items,
              {
                productId: product.id,
                name: product.name,
                sku: product.sku,
                quantity,
                unitPrice: product.price.amount,
                currency: product.price.currency,
                vendorId: product.vendorId,
              },
            ];
        return { ...cart, items, updatedAt: new Date().toISOString() };
      });
    },
    [updateCart],
  );

  const removeFromCart = useCallback(
    (cartId: string, productId: string) => {
      updateCart(cartId, (cart) => ({
        ...cart,
        items: cart.items.filter((item) => item.productId !== productId),
        updatedAt: new Date().toISOString(),
      }));
    },
    [updateCart],
  );

  const updateQuantity = useCallback(
    (cartId: string, productId: string, quantity: number) => {
      updateCart(cartId, (cart) => ({
        ...cart,
        items: cart.items.map((item) =>
          item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
        ),
        updatedAt: new Date().toISOString(),
      }));
    },
    [updateCart],
  );

  const applyCoupon = useCallback(
    (cartId: string, code: string) => {
      updateCart(cartId, (cart) => ({ ...cart, couponCode: code.length > 0 ? code : undefined }));
    },
    [updateCart],
  );

  const cartCalculation = useCallback(
    (cart: CommerceCart) =>
      calculateOrder(cart.items, {
        coupon: cart.couponCode
          ? COMMERCE_PORTFOLIO.coupons.find((coupon) => coupon.code === cart.couponCode)
          : null,
        taxRatePercent: 5,
        currency: cart.items[0]?.currency,
      }),
    [],
  );

  const subtotalOf = useCallback((cart: CommerceCart) => cartSubtotal(cart.items), []);
  const countOf = useCallback((cart: CommerceCart) => cartCount(cart.items), []);
  const couponStatusOf = useCallback(
    (coupon: CommerceCoupon, subtotal: number) => validateCoupon(coupon, subtotal),
    [],
  );

  const providersFor = useCallback(
    (method: CommercePaymentMethod) => providersForMethod(COMMERCE_PORTFOLIO.gatewayProviders, method),
    [],
  );

  const activeCouponList = useMemo(() => activeCoupons(COMMERCE_PORTFOLIO.coupons), []);
  const activePromotionList = useMemo(() => activePromotions(COMMERCE_PORTFOLIO.promotions), []);
  const enabledProviders = useMemo(() => enabledGatewayProviders(COMMERCE_PORTFOLIO.gatewayProviders), []);
  const boostPreviews = useMemo(() => BOOST_PREVIEWS, []);

  const selectedCart = useMemo(
    () => carts.find((cart) => cart.id === selectedCartId) ?? carts[0],
    [carts, selectedCartId],
  );
  const selectedCalculation = useMemo(() => (selectedCart ? cartCalculation(selectedCart) : null), [selectedCart, cartCalculation]);

  const featuredProduct = useMemo(
    () => COMMERCE_PORTFOLIO.products.find((product) => product.featured) ?? COMMERCE_PORTFOLIO.products[0],
    [],
  );

  const boostCostOf = useCallback((tierId: string, audienceSize: number) => calculateBoostCost({ tierId, audienceSize }), []);

  return useMemo(
    () => ({
      portfolio: COMMERCE_PORTFOLIO,
      statistics: COMMERCE_PORTFOLIO.statistics,
      analytics: COMMERCE_PORTFOLIO.analytics,
      revenueReport: COMMERCE_PORTFOLIO.revenueReport,
      products: COMMERCE_PORTFOLIO.products,
      featuredProduct,
      query,
      setQuery,
      category,
      setCategory,
      filteredProducts,
      carts,
      selectedCartId,
      setSelectedCartId,
      selectedCart,
      selectedCalculation,
      addToCart,
      removeFromCart,
      updateQuantity,
      applyCoupon,
      subtotalOf,
      countOf,
      couponStatusOf,
      activeCoupons: activeCouponList,
      activePromotions: activePromotionList,
      enabledProviders,
      providersFor,
      boostPreviews,
      boostCostOf,
      orders: COMMERCE_PORTFOLIO.orders,
      invoices: COMMERCE_PORTFOLIO.invoices,
      receipts: COMMERCE_PORTFOLIO.receipts,
      wallets: COMMERCE_PORTFOLIO.wallets,
      walletTransactions: COMMERCE_PORTFOLIO.walletTransactions,
      subscriptions: COMMERCE_PORTFOLIO.subscriptions,
      subscriptionPlans: COMMERCE_PORTFOLIO.subscriptionPlans,
      commissions: COMMERCE_PORTFOLIO.commissions,
      escrows: COMMERCE_PORTFOLIO.escrows,
      settlements: COMMERCE_PORTFOLIO.settlements,
      vendorEarnings: COMMERCE_PORTFOLIO.vendorEarnings,
      refunds: COMMERCE_PORTFOLIO.refunds,
      transactions: COMMERCE_PORTFOLIO.transactions,
      gatewayProviders: COMMERCE_PORTFOLIO.gatewayProviders,
      billingAddresses: COMMERCE_PORTFOLIO.billingAddresses,
    }),
    [
      query,
      category,
      filteredProducts,
      featuredProduct,
      carts,
      selectedCartId,
      selectedCart,
      selectedCalculation,
      addToCart,
      removeFromCart,
      updateQuantity,
      applyCoupon,
      subtotalOf,
      countOf,
      couponStatusOf,
      activeCouponList,
      activePromotionList,
      enabledProviders,
      providersFor,
      boostPreviews,
      boostCostOf,
    ],
  );
}
