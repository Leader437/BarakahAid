// Theme configuration based on Visily design

export const theme = {
  colors: {
    primary: '#0ea5e9',
    primaryDark: '#0284c7',
    primaryLight: '#38bdf8',
    secondary: '#64748b',
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
    accent: '#d946ef',
    background: '#ffffff',
    backgroundLight: '#f8fafc',
    text: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
  },
  
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 2px 8px rgba(0, 0, 0, 0.08)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.12)',
    xl: '0 10px 40px rgba(0, 0, 0, 0.2)',
  },

  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      heading: 'Poppins, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  transitions: {
    fast: '150ms ease-in-out',
    base: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export default theme;
