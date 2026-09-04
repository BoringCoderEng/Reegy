import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import UserLogin from '../pages/auth/UserLogin'
import UserRegister from '../pages/auth/UserRegister'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister'
import Home from '../pages/general/Home'
import CreateFood from '../pages/food-partner/createFood'
import Profile from '../pages/food-partner/profile'
import Saved from '../pages/general/Saved'
// NEW — the cart/checkout/order pages that weren't routed anywhere before
import Cart from '../pages/general/Cart'
import Checkout from '../pages/general/Checkout'
import OrderHistory from '../pages/general/OrderHistory'
import OrderTracking from '../pages/general/OrderTracking'

const AppRoutes = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/user/register"
            element={<UserRegister />} />
            <Route path="/user/login"
            element={<UserLogin />} />
            <Route path="/food-partner/register"
            element={<FoodPartnerRegister />} />
            <Route path="/food-partner/login"
            element={<FoodPartnerLogin />} />
            <Route path="/create-food" element={<CreateFood />} />
            <Route path="/food-partner/:id" element={<Profile />} />
            {/* NEW routes */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/orders/:id" element={<OrderTracking />} />
        </Routes>
    </Router>
  )
}

export default AppRoutes
