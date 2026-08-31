import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { isLoggedIn } from './pages/Login.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Shop = lazy(() => import('./pages/Shop.jsx'))
const ProductDetails = lazy(() => import('./pages/ProductDetails.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const HowToOrder = lazy(() => import('./pages/HowToOrder.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'))
const AdminProducts = lazy(() => import('./pages/AdminProducts.jsx'))
const AddProduct = lazy(() => import('./pages/AddProduct.jsx'))
const EditProduct = lazy(() => import('./pages/EditProduct.jsx'))
const ChangePassword = lazy(() => import('./pages/ChangePassword.jsx'))

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-to-order" element={<HowToOrder />} />
        </Route>

        {/* Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin routes — protected */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AddProduct />} />
          <Route path="/admin/products/:id/edit" element={<EditProduct />} />
          <Route path="/admin/change-password" element={<ChangePassword />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
