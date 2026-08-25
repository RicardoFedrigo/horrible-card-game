import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#d9d2b6',
            contrastText: '#141a16',
        },
        secondary: {
            main: '#b3542f',
            contrastText: '#ffffff',
        },
        success: {
            main: '#7c9a54',
        },
        warning: {
            main: '#c9a227',
        },
        info: {
            main: '#6b7f4a',
        },
        background: {
            default: '#0e1511',
            paper: '#1a241d',
        },
        text: {
            primary: '#e6e0c8',
            secondary: 'rgba(230, 224, 200, 0.7)',
        },
    },
    typography: {
        fontFamily: '"Libre Franklin", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h1: {
            fontFamily: '"Archivo Black", sans-serif',
            fontWeight: 400,
        },
        h2: {
            fontFamily: '"Archivo Black", sans-serif',
            fontWeight: 400,
        },
        h3: {
            fontFamily: '"Archivo Black", sans-serif',
            fontWeight: 400,
        },
        button: {
            textTransform: 'none',
            fontWeight: 700,
        },
    },
    shape: {
        borderRadius: 6,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    padding: '12px 24px',
                    fontSize: '1rem',
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: 'rgba(217, 210, 182, 0.9)',
                    },
                },
                containedSecondary: {
                    '&:hover': {
                        backgroundColor: 'rgba(179, 84, 47, 0.9)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#162019',
                        '& fieldset': {
                            borderColor: 'rgba(230, 224, 200, 0.12)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(230, 224, 200, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'rgba(179, 84, 47, 0.7)',
                        },
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 700,
                },
            },
        },
    },
});

