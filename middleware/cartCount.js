module.exports = (req, res, next) => {
  const cart = req.session.cart || [];
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  res.locals.cartCount = totalQty;
  next();
};
