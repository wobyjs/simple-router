import { test, expect } from '@playwright/test'

test.describe('Simple Router Custom Elements Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the demo page
    await page.goto('http://localhost:5176/')

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle')

    // Wait for custom elements to be defined
    await page.evaluate(() => {
      return Promise.all([
        customElements.whenDefined('woby-link'),
        customElements.whenDefined('woby-router'),
        customElements.whenDefined('woby-route')
      ])
    })
  })

  test('should display custom elements section', async ({ page }) => {
    // Check that custom elements section is visible
    await expect(page.getByText('Custom Elements Demo')).toBeVisible()

    // Check that custom router is present
    const customRouter = page.locator('woby-router')
    await expect(customRouter).toBeVisible()

    // Check that navigation links are present
    const links = page.locator('woby-link')
    await expect(links).toHaveCount(5)

    // Check specific links
    await expect(page.locator('woby-link[to="/"]')).toBeVisible()
    await expect(page.locator('woby-link[to="/about"]')).toBeVisible()
    await expect(page.locator('woby-link[to="/contact"]')).toBeVisible()
    await expect(page.locator('woby-link[to="/products"]')).toBeVisible()
    await expect(page.locator('woby-link[to="/user/john"]')).toBeVisible()
  })

  test('should navigate to About page using custom elements', async ({ page }) => {
    // Click on About link
    await page.locator('woby-link[to="/about"]').click()

    // Wait for navigation to complete
    await page.waitForURL('**/about')

    // Check that About page content is visible in the route
    const routeContent = page.locator('woby-route')
    await expect(routeContent).toBeVisible()

    // Check that the route contains About page content
    await expect(routeContent.getByText('About Page')).toBeVisible()
    await expect(routeContent.getByText('This is the about page.')).toBeVisible()

    // Check that current path displays correctly
    await expect(routeContent.getByText('Current path: /about')).toBeVisible()

    // Check that About link has active styling
    const aboutLink = page.locator('woby-link[to="/about"]')
    const aboutLinkClass = await aboutLink.getAttribute('class')
    expect(aboutLinkClass).toContain('active-link')
  })

  test('should navigate to Contact page using custom elements', async ({ page }) => {
    // Click on Contact link
    await page.locator('woby-link[to="/contact"]').click()

    // Wait for navigation to complete
    await page.waitForURL('**/contact')

    // Check that Contact page content is visible
    const routeContent = page.locator('woby-route')
    await expect(routeContent.getByText('Contact Page')).toBeVisible()
    await expect(routeContent.getByText('You can reach us here.')).toBeVisible()

    // Check that current path displays correctly
    await expect(routeContent.getByText('Current path: /contact')).toBeVisible()
  })

  test('should navigate to Products page and test navigation button', async ({ page }) => {
    // Click on Products link
    await page.locator('woby-link[to="/products"]').click()

    // Wait for navigation to complete
    await page.waitForURL('**/products')

    // Check that Products page content is visible
    const routeContent = page.locator('woby-route')
    await expect(routeContent.getByText('Products Page')).toBeVisible()
    await expect(routeContent.getByText('Browse our products.')).toBeVisible()

    // Check that current path displays correctly
    await expect(routeContent.getByText('Current path: /products')).toBeVisible()

    // Test the "Go to Home" button (this should work with the regular demo)
    await page.getByRole('button', { name: 'Go to Home' }).click()

    // Wait for navigation back to home
    await page.waitForURL('**/')

    // Verify we're back on the home page
    await expect(page.getByRole('heading', { name: 'Home Page' })).toBeVisible()
  })

  test('should navigate to User Profile page with parameter', async ({ page }) => {
    // Click on User Profile link
    await page.locator('woby-link[to="/user/john"]').click()

    // Wait for navigation to complete
    await page.waitForURL('**/user/john')

    // Check that User Profile page content is visible
    const routeContent = page.locator('woby-route')
    await expect(routeContent.getByText('User Profile')).toBeVisible()
    await expect(routeContent.getByText('Username:')).toBeVisible()

    // Check that current path displays correctly
    await expect(routeContent.getByText('Current path: /user/john')).toBeVisible()
  })

  test('should handle 404 page for non-existent routes', async ({ page }) => {
    // Navigate to a non-existent route
    await page.goto('http://localhost:5177/non-existent-page')

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

  test('should test all navigation links in sequence with custom elements', async ({ page }) => {
    const navigationLinks = [
      { selector: 'woby-link[to="/"]', path: '/', heading: 'Home Page' },
      { selector: 'woby-link[to="/about"]', path: '/about', heading: 'About Page' },
      { selector: 'woby-link[to="/contact"]', path: '/contact', heading: 'Contact Page' },
      { selector: 'woby-link[to="/products"]', path: '/products', heading: 'Products Page' },
      { selector: 'woby-link[to="/user/john"]', path: '/user/john', heading: 'User Profile' }
    ]

    // Test each navigation link in sequence
    for (const link of navigationLinks) {
      // Click the navigation link
      await page.locator(link.selector).click()

      // Wait for navigation to complete
      await page.waitForURL(`**${link.path}`)

      // Verify the correct page content is displayed
      const routeContent = page.locator('woby-route')
      await expect(routeContent.getByText(link.heading)).toBeVisible()

      // Verify the current path is displayed correctly
      await expect(routeContent.getByText(`Current path: ${link.path}`)).toBeVisible()

      console.log(`✓ Successfully navigated to ${link.heading} (${link.path}) using custom elements`)
    }
  })

  test('should maintain active link state during navigation with custom elements', async ({ page }) => {
    // Test that only one link is active at a time
    const links = [
      'woby-link[to="/"]',
      'woby-link[to="/about"]',
      'woby-link[to="/contact"]',
      'woby-link[to="/products"]',
      'woby-link[to="/user/john"]'
    ]

    for (const linkSelector of links) {
      // Click on each link
      await page.locator(linkSelector).click()
      await page.waitForURL(/.*/)

      // Check that the clicked link has active class
      const activeLink = page.locator(linkSelector)
      const activeLinkClass = await activeLink.getAttribute('class')
      expect(activeLinkClass).toContain('active-link')

      // Check that other links don't have active class
      for (const otherLinkSelector of links) {
        if (otherLinkSelector !== linkSelector) {
          const otherLink = page.locator(otherLinkSelector)
          const otherLinkClass = await otherLink.getAttribute('class') || ''
          expect(otherLinkClass).not.toContain('active-link')
        }
      }
    }
  })

  test('should test custom element attributes and properties', async ({ page }) => {
    // Check that custom elements have the correct attributes
    const homeLink = page.locator('woby-link[to="/"]')
    await expect(homeLink).toHaveAttribute('to', '/')

    const aboutLink = page.locator('woby-link[to="/about"]')
    await expect(aboutLink).toHaveAttribute('to', '/about')

    // Check that router has correct structure
    const router = page.locator('woby-router')
    await expect(router).toBeVisible()

    // Check that route element is present
    const route = page.locator('woby-route')
    await expect(route).toBeVisible()
  })
})