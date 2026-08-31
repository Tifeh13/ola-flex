import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Login() {
  return (
    <>
      <Helmet><title>Admin — OLAFLEX</title></Helmet>
      <Navigate to="/admin" replace />
    </>
  );
}
