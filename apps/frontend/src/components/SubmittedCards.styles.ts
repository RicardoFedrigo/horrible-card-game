import type { SxProps, Theme } from '@mui/material';

export const emptyStateStyles: SxProps<Theme> = {
  textAlign: 'center',
  py: 4,
};

export const titleStyles: SxProps<Theme> = {
  mb: 2,
};

export const gridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: 'repeat(auto-fit, minmax(140px, 1fr))',
    sm: 'repeat(auto-fit, minmax(160px, 180px))',
    md: 'repeat(auto-fit, minmax(160px, 180px))',
  },
  gap: 2,
  justifyContent: 'center',
};

interface SubmissionCardStylesParams {
  isRevealed: boolean;
  isSelected: boolean;
}

export const getSubmissionCardStyles = ({
  isRevealed,
  isSelected,
}: SubmissionCardStylesParams): SxProps<Theme> => ({
  p: 2,
  bgcolor: isRevealed ? 'rgba(26, 36, 29, 0.65)' : 'rgba(26, 36, 29, 0.35)',
  cursor: isRevealed ? 'pointer' : 'default',
  transition: 'all 0.25s ease',
  outline: isSelected ? '2px solid #7c9a54' : 'none',
  '&:hover': isRevealed ? {
    bgcolor: 'rgba(26, 36, 29, 0.85)',
  } : {},
});

export const revealedCardsContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1,
  justifyContent: 'center',
  animation: 'card-reveal 0.45s ease both',
};

export const hiddenCardContainerStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
};

export const hiddenCardStyles: SxProps<Theme> = {
  width: 96,
  height: 144,
  bgcolor: '#d8cfae',
  boxShadow: 'inset 0 0 18px rgba(120, 96, 58, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const hiddenCardTextStyles: SxProps<Theme> = {
  fontFamily: '"Archivo Black", sans-serif',
  color: '#221d15',
  fontSize: '1.125rem',
};

export const confirmButtonContainerStyles: SxProps<Theme> = {
  mt: 3,
  display: 'flex',
  justifyContent: 'center',
};

