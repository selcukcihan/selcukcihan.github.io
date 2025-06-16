import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			'primary-0': '#FEFAF6',
  			'primary-1': '#FFF5E1',
  			'secondary-1': '#092635',
  			'secondary-2': '#A86600',
  			'secondary-3': '#754800',
  			'light-0': '#ffb84d',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  			'gradient-x': 'gradient-x 15s ease infinite',
  			'gradient-y': 'gradient-y 15s ease infinite',
  			'gradient-xy': 'gradient-xy 15s ease infinite',
  			'float': 'float 6s ease-in-out infinite',
  			'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  		},
  		keyframes: {
  			'gradient-y': {
  				'0%, 100%': {
  					transform: 'translateY(0%)',
  				},
  				'50%': {
  					transform: 'translateY(-100%)',
  				},
  			},
  			'gradient-x': {
  				'0%, 100%': {
  					transform: 'translateX(0%)',
  				},
  				'50%': {
  					transform: 'translateX(-100%)',
  				},
  			},
  			'gradient-xy': {
  				'0%, 100%': {
  					transform: 'translate(0%, 0%)',
  				},
  				'25%': {
  					transform: 'translate(-100%, 0%)',
  				},
  				'50%': {
  					transform: 'translate(-100%, -100%)',
  				},
  				'75%': {
  					transform: 'translate(0%, -100%)',
  				},
  			},
  			'float': {
  				'0%, 100%': {
  					transform: 'translateY(0px)',
  				},
  				'50%': {
  					transform: 'translateY(-20px)',
  				},
  			},
  		},
  	},
  	listStyleType: {
  		none: 'none',
  		square: 'square',
  		disc: 'disc'
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;