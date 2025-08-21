import{createBrowserRouter} from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ForgotPassword from '../pages/ForgotPassword'
import SignUp from '../pages/SignUp'
import AdminPanel from '../pages/AdminPanel'
import AllUsers from '../pages/AllUsers'
import Profile from '../pages/Profile'
import BookCollection from '../pages/BookCollectionForm'
import BookManagement from '../pages/BookManager'
import BookReservation from '../pages/BookReservation'
import UserReservations from '../pages/UserReservations'
import AdminReservations from '../pages/AdminReservations'
import AboutUs from '../pages/AboutUs '
import EBooksLibrary from '../pages/EBooksLibrary'
import AdminEBooks from '../pages/AdminEBooks'
import PendingMemberships from '../pages/PendingMemberships '


const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "login",
                element : <Login/>
            },
            {
                path : "forgot-password",
                element : <ForgotPassword/>
            },
            {
                path : "signup",
                element : <SignUp/>
            },
            {
                path : "book-collection",
                element : <BookCollection/>
            },
            {
                path : "aboutUs",
                element : <AboutUs/>
            },
            {
                path: "e-books",
                element: <EBooksLibrary/>
            },
            {
                path: "book-reservation",
                element: <BookReservation/>
            },
            {
                path: "my-reservations",
                element: <UserReservations/>
            },
            {
                path : "profile",
                element :  <Profile/>
            },
            {
                path : "admin-panel",
                element : <AdminPanel/>,
                children : [
                    {
                        path : "all-users",
                        element : <AllUsers/>
                    },
                    {
                        path: "admin-reservations",
                        element: <AdminReservations/>
                    },
                    {
                        path: "membership-management",
                        element: <PendingMemberships/>
                    },
                    {
                        path : "book-management",
                        element : <BookManagement/>
                    },
                    {
                        path: "admin/e-books",
                        element: <AdminEBooks/>
                    },
                    
                    
                ]
            },
            
        ]
    }
])

export default router