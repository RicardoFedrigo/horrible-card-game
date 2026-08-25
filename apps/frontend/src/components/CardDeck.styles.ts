import type { SxProps, Theme } from '@mui/material';

export const deckContainerStyles: SxProps<Theme> = {
  position: 'relative',
  width: 176,
  height: 240,
};

export const getStackedCardStyles = (isBlack: boolean, index: number): SxProps<Theme> => ({
  position: 'absolute',
  inset: 0,
  bgcolor: isBlack ? '#000000' : '#ffffff',
  border: isBlack ? '2px solid rgba(255, 255, 255, 0.2)' : 'none',
  transform: `translateY(${index * -3}px) translateX(${index * 1}px) rotate(${index * 0.5}deg)`,
  zIndex: 5 - index,
});

export const getTopCardStyles = (isBlack: boolean): SxProps<Theme> => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  p: 2,
  bgcolor: isBlack ? '#000000' : '#ffffff',
  color: isBlack ? '#ffffff' : '#000000',
  border: isBlack ? '2px solid rgba(255, 255, 255, 0.3)' : 'none',
  zIndex: 6,
});

export const deckLogoStyles: SxProps<Theme> = {
  fontFamily: '"Archivo Black", sans-serif',
  letterSpacing: '-0.02em',
  mb: 1,
};

export const deckLabelStyles: SxProps<Theme> = {
  opacity: 0.6,
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
};

export const deckCountStyles: SxProps<Theme> = {
  mt: 2,
  opacity: 0.4,
};

