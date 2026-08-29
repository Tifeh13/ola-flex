import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ScrollToTopButton from '../components/ScrollToTopButton.jsx';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-olaflex-black">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
