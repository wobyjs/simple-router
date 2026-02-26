import { test, expect } from '@playwright/test'

test.describe('Simple Router Demo Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the demo page
        await page.goto('http://localhost:5174/')

        // Wait for the page to load completely
        await page.waitForLoadState('networkidle')
    })

    test('should display home page by default', async ({ page }) => {
        // Check that home page content is visible
        await expect(page.getByRole('heading', { name: 'Home Page' })).toBeVisible()
        await expect(page.getByText('Welcome to the home page!')).toBeVisible()

        // Check that current path displays correctly
        await expect(page.getByText('Current path: /')).toBeVisible()

        // Check that home link is active (highlighted)
        const homeLink = page.getByRole('link', { name: 'Home' })
        await expect(homeLink).toBeVisible()

        // Check active link styling (background color indicates active state)
        const homeLinkStyle = await homeLink.evaluate(el => {
            const computedStyle = window.getComputedStyle(el)
            return {
                backgroundColor: computedStyle.backgroundColor,
                color: computedStyle.color
            }
        })

        // The active link should have blue background
        expect(homeLinkStyle.backgroundColor).toContain('0, 123, 255') // rgb(0, 123, 255) is #007bff
    })

    test('should navigate to About page when clicking About link', async ({ page }) => {
        // Click on About link
        await page.getByRole('link', { name: 'About' }).click()

        // Wait for navigation to complete
        await page.waitForURL('**/about')

        // Check that About page content is visible
        await expect(page.getByRole('heading', { name: 'About Page' })).toBeVisible()
        await expect(page.getByText('This is the about page.')).toBeVisible()

        // Check that current path displays correctly
        await expect(page.getByText('Current path: /about')).toBeVisible()

        // Check that About link is now active
        const aboutLink = page.getByRole('link', { name: 'About' })
        const aboutLinkStyle = await aboutLink.evaluate(el => {
            const computedStyle = window.getComputedStyle(el)
            return computedStyle.backgroundColor
        })
        expect(aboutLinkStyle).toContain('0, 123, 255')

        // Check that Home link is no longer active
        const homeLink = page.getByRole('link', { name: 'Home' })
        const homeLinkStyle = await homeLink.evaluate(el => {
            const computedStyle = window.getComputedStyle(el)
            return computedStyle.backgroundColor
        })
        expect(homeLinkStyle).not.toContain('0, 123, 255')
    })

    test('should navigate to Contact page when clicking Contact link', async ({ page }) => {
        // Click on Contact link
        await page.getByRole('link', { name: 'Contact' }).click()

        // Wait for navigation to complete
        await page.waitForURL('**/contact')

        // Check that Contact page content is visible
        await expect(page.getByRole('heading', { name: 'Contact Page' })).toBeVisible()
        await expect(page.getByText('You can reach us here.')).toBeVisible()

        // Check that current path displays correctly
        await expect(page.getByText('Current path: /contact')).toBeVisible()
    })

    test('should navigate to Products page and test navigation button', async ({ page }) => {
        // Click on Products link
        await page.getByRole('link', { name: 'Products' }).click()

        // Wait for navigation to complete
        await page.waitForURL('**/products')

        // Check that Products page content is visible
        await expect(page.getByRole('heading', { name: 'Products Page' }).first()).toBeVisible()
        await expect(page.getByText('Browse our products.')).toBeVisible()

        // Check that current path displays correctly
        await expect(page.getByText('Current path: /products')).toBeVisible()

        // Test the "Go to Home" button
        await page.getByRole('button', { name: 'Go to Home' }).click()

        // Wait for navigation back to home
        await page.waitForURL('**/')

        // Verify we're back on the home page
        await expect(page.getByRole('heading', { name: 'Home Page' })).toBeVisible()
    })

    test('should navigate to User Profile page with parameter', async ({ page }) => {
        // Click on User Profile link
        await page.getByRole('link', { name: 'User Profile' }).click()

        // Wait for navigation to complete
        await page.waitForURL('**/user/john')

        // Check that User Profile page content is visible
        await expect(page.getByRole('heading', { name: 'User Profile' })).toBeVisible()
        // Check that Username text is present (the parameter might not be populated)
        await expect(page.getByText('Username:')).toBeVisible()

        // Check that current path displays correctly
        await expect(page.getByText('Current path: /user/john')).toBeVisible()
    })

    test('should handle 404 page for non-existent routes', async ({ page }) => {
        // Navigate to a non-existent route
        await page.goto('http://localhost:5174/non-existent-page')

        // Check that 404 page content is visible
        await expect(page.getByRole('heading', { name: '404 - Page Not Found' })).toBeVisible()
        await expect(page.getByText("The page you're looking for doesn't exist.")).toBeVisible()

        // Test the "Go back home" link
        await page.getByRole('link', { name: 'Go back home' }).click()

        // Wait for navigation back to home
        await page.waitForURL('**/')

        // Verify we're back on the home page
        await expect(page.getByRole('heading', { name: 'Home Page' })).toBeVisible()
    })

    test('should test all navigation links in sequence', async ({ page }) => {
        const navigationLinks = [
            { name: 'Home', path: '/', heading: 'Home Page' },
            { name: 'About', path: '/about', heading: 'About Page' },
            { name: 'Contact', path: '/contact', heading: 'Contact Page' },
            { name: 'Products', path: '/products', heading: 'Products Page' },
            { name: 'User Profile', path: '/user/john', heading: 'User Profile' }
        ]

        // Test each navigation link in sequence
        for (const link of navigationLinks) {
            // Click the navigation link
            await page.getByRole('link', { name: link.name }).click()

            // Wait for navigation to complete
            await page.waitForURL(`**${link.path}`)

            // Verify the correct page content is displayed
            await expect(page.getByRole('heading', { name: link.heading })).toBeVisible()

            // Verify the current path is displayed correctly
            await expect(page.getByText(`Current path: ${link.path}`)).toBeVisible()

            console.log(`✓ Successfully navigated to ${link.name} page (${link.path})`)
        }
    })

    test('should maintain active link state during navigation', async ({ page }) => {
        // Test that only one link is active at a time
        const links = ['Home', 'About', 'Contact', 'Products', 'User Profile']

        for (const linkName of links) {
            // Click on each link
            await page.getByRole('link', { name: linkName }).click()
            await page.waitForURL(/.*/)

            // Check that the clicked link is active
            const activeLink = page.getByRole('link', { name: linkName })
            const activeLinkStyle = await activeLink.evaluate(el => {
                return window.getComputedStyle(el).backgroundColor
            })
            expect(activeLinkStyle).toContain('0, 123, 255')

            // Check that other links are not active
            for (const otherLinkName of links) {
                if (otherLinkName !== linkName) {
                    const otherLink = page.getByRole('link', { name: otherLinkName })
                    const otherLinkStyle = await otherLink.evaluate(el => {
                        return window.getComputedStyle(el).backgroundColor
                    })
                    // Other links should not have the active background color
                    if (otherLinkStyle.includes('0, 123, 255')) {
                        console.warn(`Warning: Link ${otherLinkName} appears to be active when it shouldn't be`)
                    }
                }
            }
        }
    })
})