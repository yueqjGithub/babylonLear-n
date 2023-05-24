import { useEffect } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import styles from './layout.module.scss'
const PageLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { pathname } = location
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token && pathname !== '/login') {
      navigate('/login', {
        replace: true
      })
    }
  }, [pathname])
  return (
    <div className="pageContainer flex-row flex-jst-btw flex-ali-center">
      <div className={`${styles.menuContainer} full-height`}>
        <h3>入门</h3>
        <ul>
          <li><Link className="text-primary" to={'/home'}>HOME</Link></li>
        </ul>
      </div>
      <div className={`${styles.contentContainer} flex-1 full-height`}>
        <div className={`${styles.contentOutlet} full-height scroll-bar`}>
        <Outlet></Outlet>
        </div>
      </div>
    </div>
  )
}

export default PageLayout
