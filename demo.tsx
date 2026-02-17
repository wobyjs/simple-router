import { render, $ } from 'woby'
import { Router, Route, Link, useLocation, useNavigate, useParams } from './src'

// Define sample pages/components
const Home = () => (
    <div>
        <h2>Home Page</h2>
        <p>Welcome to the home page!</p>
        <p>Current path: {useLocation().pathname}</p>
    </div>
)

const About = () => (
    <div>
        <h2>About Page</h2>
        <p>This is the about page.</p>
        <p>Current path: {useLocation().pathname}</p>
    </div>
)

const Contact = () => (
    <div>
        <h2>Contact Page</h2>
        <p>You can reach us here.</p>
        <p>Current path: {useLocation().pathname}</p>
    </div>
)

const NotFound = () => (
    <div>
        <h2>404 - Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/">Go back home</Link>
    </div>
)

const UserProfile = () => {
    const params = useParams()
    return (
        <div>
            <h2>User Profile</h2>
            <p>Username: {params.username}</p>
            <p>Current path: {useLocation().pathname}</p>
        </div>
    )
}

const Products = () => {
    const navigate = useNavigate()
    return (
        <div>
            <h2>Products Page</h2>
            <p>Browse our products.</p>
            <p>Current path: {useLocation().pathname}</p>
            <button onclick={() => navigate('/')}>Go to Home</button>
        </div>
    )
}

// Navigation helper component to highlight active links
const ActiveLink = ({ to, children }) => {
    const location = useLocation()

    return (
        <Link
            to={to}
            style={() => ({
                textDecoration: 'none',
                marginRight: '1rem',
                backgroundColor: location.pathname() === to ? '#007bff' : 'transparent',
                color: location.pathname() === to ? 'white' : '#333',
                padding: '0.5rem',
                borderRadius: '4px'
            })}
        >
            {children}
        </Link>
    )
}

// Main App component
const App = () => {
    const routes = [
        { path: '/', to: <Home /> },
        { path: '/about', to: <About /> },
        { path: '/contact', to: <Contact /> },
        { path: '/products', to: <Products /> },
        { path: '/user/:username', to: <UserProfile /> },
        { path: '/404', to: <NotFound /> }
    ]

    return (
        <div>
            <h1>Simple Router Demo</h1>
            <Router routes={routes}>
                <div>
                    <nav>
                        <ActiveLink to="/">Home</ActiveLink>
                        <ActiveLink to="/about">About</ActiveLink>
                        <ActiveLink to="/contact">Contact</ActiveLink>
                        <ActiveLink to="/products">Products</ActiveLink>
                        <ActiveLink to="/user/john">User Profile</ActiveLink>
                    </nav>

                    <div className="content" style={{
                        padding: '1rem',
                        border: '1px solid #eee',
                        minHeight: '200px',
                        marginTop: '1rem'
                    }}>
                        <Route />
                    </div>
                </div>
            </Router>

            <div className="footer" style={{
                marginTop: '2rem',
                paddingTop: '1rem',
                borderTop: '1px solid #eee',
                color: '#666'
            }}>
                <p>Simple Router Demo - A lightweight isomorphic router for Woby</p>
            </div>
        </div>
    )
}

// Render the app when DOM is ready
const renderApp = () => {
    const appElement = document.getElementById('app')
    if (appElement) {
        render(<App />, appElement)
    } else {
        console.error('App element not found!')
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp)
} else {
    // Small delay to ensure DOM is fully ready
    setTimeout(renderApp, 0)
}