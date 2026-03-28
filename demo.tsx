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
            style={{
                textDecoration: 'none',
                marginRight: '1rem',
                backgroundColor: () => location.pathname() === to ? '#007bff' : 'transparent',
                color: () => location.pathname() === to ? 'white' : '#333',
                padding: '0.5rem',
                borderRadius: '4px'
            }}
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

// Self-test runner
const runSelfTest = async () => {
    console.log('%c=== SIMPLE ROUTER SELF-TEST STARTING ===', 'background: #222; color: #bada55; font-size: 16px; font-weight: bold; padding: 10px;')

    const tests = [
        { name: 'Home Route', path: '/', expectedText: 'Home Page', expectedUrl: '/' },
        { name: 'About Route', path: '/about', expectedText: 'About Page', expectedUrl: '/about' },
        { name: 'Contact Route', path: '/contact', expectedText: 'Contact Page', expectedUrl: '/contact' },
        { name: 'Products Route', path: '/products', expectedText: 'Products Page', expectedUrl: '/products' },
        { name: 'User Profile Route', path: '/user/john', expectedText: 'User Profile', expectedUrl: '/user/john' },
        { name: '404 Route', path: '/nonexistent', expectedText: '404 - Page Not Found', expectedUrl: '/nonexistent' }
    ]

    for (let i = 0; i < tests.length; i++) {
        const test = tests[i]
        console.group(`\n%cTest ${i + 1}/${tests.length}: ${test.name}`, 'color: #007bff; font-weight: bold;')

        // Log test expectations
        console.log('%cEXPECTATIONS:', 'color: #ff9800; font-weight: bold;')
        console.log(`  - Navigate to: ${test.path}`)
        console.log(`  - Expected URL: ${test.expectedUrl}`)
        console.log(`  - Expected content contains: "${test.expectedText}"`)
        console.log(`  - Both TSX Router AND Custom Element woby-router should match`)

        try {
            // Navigate to the route
            console.log('\n%cACTION: Navigating...', 'color: #4caf50; font-weight: bold;')
            window.history.pushState({}, '', test.path)
            window.dispatchEvent(new Event('popstate'))

            // Wait for rendering
            await new Promise(resolve => setTimeout(resolve, 150))

            // Verify URL
            const actualUrl = window.location.pathname
            console.log('\n%cRESULT - URL Check:', 'color: #2196f3; font-weight: bold;')
            console.log(`  - Actual URL: ${actualUrl}`)
            console.log(`  - URL Match: ${actualUrl === test.expectedUrl ? '✅ PASS' : '❌ FAIL'}`)

            // Verify both Custom Element and TSX Component content
            const allContentElements = document.querySelectorAll('.content')

            // Must have exactly 2 .content elements: 1st for custom element, 2nd for TSX
            console.log('\n%cDOM Check:', 'color: #607d8b; font-weight: bold;')
            console.log(`  - Found ${allContentElements.length} .content element(s) (expected: 2)`)

            if (allContentElements.length !== 2) {
                console.warn(`%c⚠️ WARNING: Expected 2 .content elements but found ${allContentElements.length}`, 'color: #ff9800;')
            }

            // Helper to get text content including shadow DOM (util.tsx technique)
            const getTextIncludingShadow = (element: Element): string => {
                if (!element) return ''
                let text = element.textContent || ''
                // Check for shadow root and include its text content
                const shadowRoot = (element as any).shadowRoot
                if (shadowRoot) {
                    text = shadowRoot.textContent || ''
                }
                return text
            }

            // 1st element is for Custom Element woby-router
            const customContentElement = allContentElements[0]
            // For custom element, check if it contains woby-route with shadow DOM
            const wobyRoute = customContentElement.querySelector('woby-route') as Element
            const customActualContent = wobyRoute ? getTextIncludingShadow(wobyRoute) : getTextIncludingShadow(customContentElement)
            const customContentMatch = customActualContent.includes(test.expectedText)
            console.log('\n%cRESULT - Custom Element woby-router (1st element):', 'color: #ff5722; font-weight: bold;')
            console.log(`  - Content contains "${test.expectedText}": ${customContentMatch ? '✅ PASS' : '❌ FAIL'}`)
            if (!customContentMatch) {
                console.log(`  - Actual content preview: "${customActualContent.substring(0, 100)}..."`)
            } else {
                console.log(`  - ✅ Shadow DOM content detected!`)
            }

            // 2nd element is for TSX Router component
            const tsxContentElement = allContentElements[1]
            const tsxActualContent = tsxContentElement?.textContent || ''
            const tsxContentMatch = tsxActualContent.includes(test.expectedText)
            console.log('\n%cRESULT - TSX Router Component (2nd element):', 'color: #9c27b0; font-weight: bold;')
            console.log(`  - Content contains "${test.expectedText}": ${tsxContentMatch ? '✅ PASS' : '❌ FAIL'}`)
            if (!tsxContentMatch) {
                console.log(`  - Actual content preview: "${tsxActualContent.substring(0, 100)}..."`)
            }

            // Compare TSX vs Custom Element
            const bothMatch = tsxContentMatch && customContentMatch
            console.log('\n%cCOMPARISON - TSX vs Custom Element:', 'color: #00bcd4; font-weight: bold;')
            console.log(`  - Both render same content: ${bothMatch ? '✅ MATCH' : '⚠️ DIVERGENCE'}`)
            if (!bothMatch) {
                console.log(`  - ⚠️ TSX and Custom Element have different content!`)
            }

            // Overall test result
            const passed = actualUrl === test.expectedUrl && tsxContentMatch && customContentMatch
            console.log(`\n%cTEST ${i + 1} RESULT: ${passed ? '✅ PASSED' : '❌ FAILED'}`, `font-size: 14px; font-weight: bold; color: ${passed ? '#4caf50' : '#f44336'};`)
            console.log(`  - URL: ${actualUrl === test.expectedUrl ? '✅' : '❌'}`)
            console.log(`  - TSX Component: ${tsxContentMatch ? '✅' : '❌'}`)
            console.log(`  - Custom Element: ${customContentMatch ? '✅' : '❌'}`)

        } catch (error) {
            console.error(`%cTEST ${i + 1} ERROR:`, 'color: #f44336; font-weight: bold;', error)
        }

        console.groupEnd()

        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 200))
    }

    console.log('%c\n=== SIMPLE ROUTER SELF-TEST COMPLETE ===', 'background: #222; color: #bada55; font-size: 16px; font-weight: bold; padding: 10px;')
    console.log('%cSummary: All routes tested for both TSX Router component and Custom Element woby-router', 'background: #ffeb3b; color: #000; font-size: 14px; padding: 5px;')
    console.log('%cCheck console above for individual test results. Open browser DevTools Console to see detailed logs.', 'background: #ffeb3b; color: #000; font-size: 13px; padding: 5px;')
}

// Render the app when DOM is ready
const renderApp = () => {
    const appElement = document.getElementById('app')
    if (appElement) {
        render(<App />, appElement)

        // Add test button after render
        setTimeout(() => {
            const testButton = document.createElement('button')
            testButton.textContent = '🧪 Run Self-Test (Check Console)'
            testButton.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                padding: 12px 20px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                z-index: 9999;
            `
            testButton.onmouseover = () => testButton.style.background = '#0056b3'
            testButton.onmouseout = () => testButton.style.background = '#007bff'
            testButton.onclick = () => {
                console.clear()
                runSelfTest()
            }
            document.body.appendChild(testButton)

            console.log('%cWelcome to Simple Router Demo!', 'background: #4caf50; color: white; font-size: 14px; padding: 5px;')
            console.log('%cAuto-running self-test in 2 seconds... (disable by removing auto-click in demo.tsx)', 'background: #ffeb3b; color: #000; font-size: 13px; padding: 5px;')
            console.log('%cOr manually click the navigation links above to test routing interactively.', 'background: #ffeb3b; color: #000; font-size: 13px; padding: 5px;')

            // Auto-run self-test after 2 seconds
            setTimeout(() => {
                console.clear()
                testButton.click()
            }, 2000)
        }, 100)
    } else {
        console.error('App element not found!')
    }

    // Set routes on the custom element woby-router
    // Routes are shared between the TSX Router and the custom element woby-router
    const customRouter = document.getElementById('custom-router') as any
    if (customRouter?.props?.routes) {
        customRouter.props.routes([
            { path: '/', to: <Home /> },
            { path: '/about', to: <About /> },
            { path: '/contact', to: <Contact /> },
            { path: '/products', to: <Products /> },
            { path: '/user/:username', to: <UserProfile /> },
            { path: '/404', to: <NotFound /> }
        ])
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp)
} else {
    // Small delay to ensure DOM is fully ready
    setTimeout(renderApp, 0)
}