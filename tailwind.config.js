const plugin = require('tailwindcss/plugin')
module.exports = {
    mode: 'aot',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        fontFamily: {
            'serif': ['serif'],
            'display': ['Karla', 'sans-serif'],
            'sans': ['Karla', 'sans-serif'],
            'mono': ['monospace']
        },
        color:{
            'django-blue': '#d2e2ed',
            'light-grey':'#eff6ff',
            
        }
    },
    variants: {
        extend: {
            
        },
    },
    plugins: [
        
    ],
    
}
