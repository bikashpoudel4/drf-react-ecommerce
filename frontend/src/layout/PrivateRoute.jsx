import {Navigate} from 'react-router-dom'
import {useAuthStore} from '../store/auth'

const PrivateRoute = ({childern}) => {
    const loggedIn = useAuthStore((state) => state.isLoggedIn)()
    return loggedIn ? <>{childern}</> : <Navigate to={'/login'} />
}

export default PrivateRoute