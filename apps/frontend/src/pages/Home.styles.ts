import type { SxProps, Theme } from '@mui/material';

export const pageContainerStyles: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  p: 3,
  position: 'relative',
  overflow: 'hidden',
};

export const decorativeCircle1Styles: SxProps<Theme> = {
  position: 'fixed',
  top: -80,
  left: -80,
  width: 384,
  height: 384,
  bgcolor: 'rgba(179, 84, 47, 0.08)',
  borderRadius: '50%',
  filter: 'blur(60px)',
  animation: 'pulse 4s ease-in-out infinite',
  '@keyframes pulse': {
    '0%, 100%': { opacity: 0.5 },
    '50%': { opacity: 1 },
  },
};

export const decorativeCircle2Styles: SxProps<Theme> = {
  position: 'fixed',
  bottom: -128,
  right: -128,
  width: 500,
  height: 500,
  bgcolor: 'rgba(107, 127, 74, 0.06)',
  borderRadius: '50%',
  filter: 'blur(60px)',
};

export const logoContainerStyles: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
  textAlign: 'center',
  mb: 6,
};

export const titleStyles: SxProps<Theme> = {
  fontSize: { xs: '3rem', md: '4.5rem' },
  letterSpacing: '-0.02em',
  lineHeight: 1.1,
  mb: 2,
};

export const subtitleStyles: SxProps<Theme> = {
  color: 'text.secondary',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
};

export const connectionStatusStyles: SxProps<Theme> = {
  mt: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1,
};

export const getConnectionIconStyles = (isConnected: boolean): SxProps<Theme> => ({
  fontSize: 10,
  color: isConnected ? 'success.main' : 'secondary.main',
  animation: isConnected ? 'pulse 2s infinite' : 'none',
});

export const cardContainerStyles: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
};

export const formPaperStyles: SxProps<Theme> = {
  p: 4,
  bgcolor: 'background.paper',
  border: '1px solid rgba(230, 224, 200, 0.12)',
};

export const tabsStyles: SxProps<Theme> = {
  mb: 4,
  bgcolor: 'rgba(22, 32, 25, 0.7)',
  borderRadius: 2,
  p: 0.5,
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTab-root': {
    borderRadius: 1.5,
    minHeight: 48,
    '&.Mui-selected': {
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
    },
  },
};

export const alertStyles: SxProps<Theme> = {
  mb: 3,
};

export const textFieldStyles: SxProps<Theme> = {
  mb: 3,
};

export const buttonStyles: SxProps<Theme> = {
  py: 1.5,
};

export const loadingContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const roomCodeInputStyles = {
  textAlign: 'center' as const,
  letterSpacing: '0.3em',
  fontSize: '1.25rem',
  fontFamily: 'monospace',
};

export const floatingCard1Styles: SxProps<Theme> = {
  position: 'absolute',
  top: -32,
  left: -48,
  width: 80,
  height: 112,
  bgcolor: '#d8cfae',
  transform: 'rotate(-12deg)',
  opacity: 0.2,
  zIndex: -1,
};

export const floatingCard2Styles: SxProps<Theme> = {
  position: 'absolute',
  bottom: -24,
  right: -40,
  width: 80,
  height: 112,
  bgcolor: '#151210',
  border: '2px solid #d8cfae',
  transform: 'rotate(12deg)',
  opacity: 0.4,
  zIndex: -1,
};

export const footerStyles: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
  mt: 6,
  opacity: 0.5,
};

