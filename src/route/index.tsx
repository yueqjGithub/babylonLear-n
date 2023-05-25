import { RouteObject, useRoutes, useNavigate } from "react-router";

import LoginPage from "../pages/Login";
import PageLayout from "../layout/pageLayout";
import { lazy, useEffect } from "react";
import LazyImportComponent from "../components/LazyImportComponent";

const Home = lazy(() => import('../pages/Home'))
const RedirectComponent = (props: { to: string }) => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(props.to, {
      replace: true
    })
  }, [])
  return null
}

const routeList: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <PageLayout></PageLayout>,
    children: [
      {
        path: 'home',
        element: <LazyImportComponent lazyChildren={Home} />,
      },
      {
        path: 'village',
        element: <LazyImportComponent lazyChildren={lazy(() => import('../pages/village'))} />,
      },
      {
        index: true,
        // element: <div onClick={() => {
        //   document.documentElement.style.setProperty('--color-primary', 'red')
        // }}>THIS IS DEFAULT CONTENT</div>
        element: <RedirectComponent to="/home" />
      }
    ]
  },
  {
    path: '*',
    element: <>THIS IS 404 PAGE</>
  }
]


const RouteWarpper = () => {
  const Wrapper = useRoutes(routeList)
  return Wrapper
}

export default RouteWarpper