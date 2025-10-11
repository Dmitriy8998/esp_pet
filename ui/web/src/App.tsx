import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LedStick from "./pages/LedStick";
import Layout from './components/Layout/Layout';
import SmartLamp from './pages/SmartLamp';
import DeviceEmpty from './pages/DeviceEmpty';

export default function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout/>,
      children: [
    {
      path: '/stick',
      element: (
        <LedStick/>
      ),
    },
    {
      path: '/lamp',
      element: (
        <SmartLamp/>
      ),
    },
    {
      path: '/empty',
      element: (
        <DeviceEmpty/>
      ),
    },
      ]
    }
]);

  return (
  <RouterProvider router={router}/>
  )
}
