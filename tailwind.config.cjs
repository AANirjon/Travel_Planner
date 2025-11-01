/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './lib/**/*.{js,ts,jsx,tsx}'
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: 'var(--color-background)',
                foreground: 'var(--color-foreground)',
                card: 'var(--color-card)',
                'card-foreground': 'var(--color-card-foreground)',
                primary: 'var(--color-primary)',
                'primary-foreground': 'var(--color-primary-foreground)',
                secondary: 'var(--color-secondary)',
                'secondary-foreground': 'var(--color-secondary-foreground)',
                muted: 'var(--color-muted)',
                'muted-foreground': 'var(--color-muted-foreground)',
                accent: 'var(--color-accent)',
                'accent-foreground': 'var(--color-accent-foreground)',
                destructive: 'var(--color-destructive)',
                border: 'var(--color-border)',
                input: 'var(--color-input)',
                ring: 'var(--color-ring)'
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    lg: '2rem'
                }
            }
        }
    },
    plugins: []
};
