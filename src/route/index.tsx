import { RouteObject, useRoutes, useNavigate } from "react-router";

import LoginPage from "../pages/Login";
import PageLayout from "../layout/pageLayout";
import { lazy, useEffect } from "react";

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
        Component: lazy(() => import('../pages/Home'))
      },
      {
        path: 'village',
        Component: lazy(() => import('../pages/village'))
      },
      {
        path: 'car',
        Component: lazy(() => import('../pages/Car'))
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