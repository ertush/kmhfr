const plugin = require('tailwindcss/plugin')
module.exports = {
    mode: 'aot',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            'serif': ['serif'],
            'display': ['Karla', 'sans-serif'],
            'sans': ['Karla', 'sans-serif'],
            'mono': ['monospace']
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [
        
    ],
}
