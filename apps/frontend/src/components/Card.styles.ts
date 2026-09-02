import type { SxProps, Theme } from '@mui/material';

export const sizeStyles = {
  sm: { width: 128, height: 176, fontSize: '0.875rem', padding: 1.5 },
  md: { width: 176, height: 240, fontSize: '1rem', padding: 2 },
  lg: { width: 224, height: 304, fontSize: '1.125rem', padding: 2.5 },
};

interface CardStylesParams {
  isBlack: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  hasOnClick: boolean;
  size: 'sm' | 'md' | 'lg';
}

export const getCardStyles = ({
  isBlack,
  isSelected,
  isDisabled,
  hasOnClick,
  size,
}: CardStylesParams): SxProps<Theme> => {
  const styles = sizeStyles[size];

  return {
    width: styles.width,
    height: styles.height,
    p: styles.padding,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: hasOnClick && !isDisabled ? 'pointer' : 'default',
    bgcolor: isBlack ? '#151210' : '#d8cfae',
    color: isBlack ? '#e6e0c8' : '#221d15',
    border: isBlack
      ? '2px solid rgba(230, 224, 200, 0.18)'
      : '2px solid rgba(74, 60, 38, 0.35)',
    boxShadow: isBlack
      ? 'inset 0 0 24px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.5)'
      : 'inset 0 0 20px rgba(120, 96, 58, 0.28), 0 2px 6px rgba(0,0,0,0.5)',
    transition: 'all 0.2s ease-out',
    transform: isSelected ? 'translateY(-8px) scale(1.05)' : 'none',
    opacity: isDisabled ? 0.5 : 1,
    position: 'relative',
    outline: isSelected ? '3px solid #7c9a54' : 'none',
    outlineOffset: 2,
    '&:hover': hasOnClick && !isDisabled ? {
      transform: 'translateY(-4px)',
      boxShadow: 8,
    } : {},
    '&:active': hasOnClick && !isDisabled ? {
      transform: 'scale(0.98)',
    } : {},
  };
};

export const cardTextStyles = (fontSize: string): SxProps<Theme> => ({
  fontSize,
  fontWeight: 700,
  lineHeight: 1.3,
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
});

export const cardFooterStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  mt: 1,
};

export const cardLogoStyles: SxProps<Theme> = {
  opacity: 0.6,
  letterSpacing: '0.1em',
};

export const pickChipStyles: SxProps<Theme> = {
  bgcolor: '#ffffff',
  color: '#000000',
  fontWeight: 700,
  fontSize: '0.65rem',
  height: 20,
};

export const selectedIndicatorStyles: SxProps<Theme> = {
  position: 'absolute',
  top: -8,
  right: -8,
  width: 24,
  height: 24,
  bgcolor: 'success.main',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const checkIconStyles: SxProps<Theme> = {
  fontSize: 16,
  color: '#ffffff',
};

