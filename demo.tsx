import { render, $$, useMemo, customElement, defaults, createContext, useContext, useEffect, type JSX, SYMBOL_JSX } from 'woby'
import { Router, Route, Link, useLocation, useNavigate, useParams, useIsActive } from './src'
import './src/input.css'

// ─── TEST CONTEXT HOOK PATTERN (from TestContextHook.html.tsx) ──────────────
const readerContext = createContext<string>()
const otherContext = createContext<string>()
customElement('reader-context', readerContext.Provider)
customElement('other-context', otherContext.Provider)

const Reader = defaults(() => ({}), (props) => {
    const ctx = useContext(readerContext)
    const oth = useContext(otherContext)
    
    return <p>{$$(ctx)} other: {$$(oth)}</p>
})

customElement('test-reader', Reader)

// Programmatically change other-context value after mount
useEffect(() => {
    setTimeout(() => {
        const otherContextEl = document.querySelector('other-context')
        if (otherContextEl) {
            otherContextEl.setAttribute('value', '456')
            
            // Log test results
            const testLog = document.getElementById('test-log')
            if (testLog) {
                const readers = document.querySelectorAll('test-reader')
                const results: string[] = []
                readers.forEach((el, idx) => {
                    const shadowRoot = (el as any).shadowRoot
                    if (shadowRoot) {
                        const text = shadowRoot.textContent?.trim()
                        results.push(`Reader ${idx}: ${text}`)
                    }
                })
                testLog.textContent = results.join('\n') + '\n\nExpected all readers to show "outer other: 123" or "inner other: 123"'
            }
        }
    }, 1000)
}, [])
// Define sample pages/components
export const Home = () => (
    <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Home Page</h2>
        <p className="text-gray-600">Welcome to the home page!</p>
        <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded-md">Current path: {()=>$$(useLocation().pathname)}</p>
    </div>
)

export const About = () => (
    <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">About Page</h2>
        <p className="text-gray-600">This is the about page.</p>
        <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded-md">Current path: {()=>$$(useLocation().pathname)}</p>
    </div>
)

export const Contact = () => (
    <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Contact Page</h2>
        <p className="text-gray-600">You can reach us here.</p>
        <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded-md">Current path: {$$(useLocation().pathname)}</p>
    </div>
)

export const NotFound = () => (
    <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-red-600">404 - Page Not Found</h2>
        <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Go back home</Link>
    </div>
)

export const UserProfile = () => {
    const params = useParams()
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-lg"><span className="font-medium text-gray-700">Username:</span> <span className="text-blue-600 font-semibold">{$$(params.username)}</span></p>
            </div>
            <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded-md">Current path: {$$(useLocation().pathname)}</p>
        </div>
    )
}

export const Products = () => {
    const navigate = useNavigate()
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Products Page</h2>
            <p className="text-gray-600">Browse our products.</p>
            <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded-md">Current path: {$$(useLocation().pathname)}</p>
            <button onClick={() => navigate('/')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">Go to Home</button>
        </div>
    )
}

// Navigation helper custom element to highlight active links
const defButton = () => ({})
const ButtonComponent = defaults(defButton, (props): JSX.Element => {
    const isActive = useIsActive()

    return <span class={[() => $$(isActive) ? 'bg-blue-600 text-white' : 'hover:bg-gray-200', 'inline-block px-3 py-2 rounded']}>
        {props.children}
    </span>
})

// Register as custom element
customElement('active-button', ButtonComponent)

// Type augmentation for JSX support
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'active-button': any
        }
    }
}

const Button = ButtonComponent


// ─── CONTEXT DIAGNOSTIC (embedded from TestContextHook.tsx pattern) ───────────
// A known-working woby context test embedded here to compare with router context.
// If this works but router context doesn't, the problem is router-specific.
const DiagContext = createContext<string>()

const DiagReader = () => {
    const val = useContext(DiagContext)
    return <p style="margin:2px 0">DiagContext value: <b>{val ?? '❌ undefined'}</b></p>
}

const RouterStateReader = () => {
    const loc = useLocation()
    const pn = loc?.pathname
    const val = pn ? $$(pn) : undefined
    return <p style="margin:2px 0">Router pathname: <b>{val ?? '❌ undefined/empty'}</b></p>
}

// ─── END CONTEXT DIAGNOSTIC ──────────────────────────────────────────────────

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
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Simple Router Demo (TSX)</h1>
                <Router routes={routes}>
                    <div>
                        <nav className="bg-white shadow-md rounded-lg p-4 mb-6">
                            <Link to="/"><Button>Home</Button></Link>
                            <Link to="/about"><Button>About</Button></Link>
                            <Link to="/contact"><Button>Contact</Button></Link>
                            <Link to="/products"><Button>Products</Button></Link>
                            <Link to="/user/john"><Button>User Profile</Button></Link>
                        </nav>

                        <div className="content bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[200px]">
                            <Route />
                        </div>
                    </div>
                </Router>

                <footer className="mt-8 pt-6 border-t border-gray-300 text-gray-600 text-center">
                    <p>Simple Router Demo - A lightweight isomorphic router for Woby</p>
                </footer>
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
        // COMMENTED OUT TO AVOID INTERFERING WITH MANUAL TESTING
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

    // Set routes on the custom element woby-router (only if it exists - for web component variant)
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

// Call renderApp when 
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp)
} else {
    // Small delay to ensure DOM is fully ready
    setTimeout(renderApp, 0)
}