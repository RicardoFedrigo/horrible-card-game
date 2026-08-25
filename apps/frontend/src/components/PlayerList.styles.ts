import type { SxProps, Theme } from '@mui/material';

export const containerStyles: SxProps<Theme> = {
    bgcolor: 'rgba(42, 42, 42, 0.5)',
    p: 2,
    borderRadius: 3,
};

export const titleStyles: SxProps<Theme> = {
    color: 'text.secondary',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    mb: 2,
};

export const listStyles: SxProps<Theme> = {
    listStyle: 'none',
    p: 0,
    m: 0,
};

export const getPlayerItemStyles = (isCurrentPlayer: boolean): SxProps<Theme> => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    p: 1.5,
    mb: 1,
    borderRadius: 2,
    bgcolor: isCurrentPlayer ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)',
    border: isCurrentPlayer ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
    transition: 'all 0.2s',
});

export const playerInfoStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
};

export const getAvatarStyles = (isHighlighted = false): SxProps<Theme> => ({
    width: 32,
    height: 32,
    bgcolor: isHighlighted ? 'secondary.main' : 'primary.main',
    color: isHighlighted ? '#ffffff' : '#000000',
    fontSize: '0.875rem',
    fontWeight: 700,
});

export const youLabelStyles: SxProps<Theme> = {
    ml: 0.5,
};

export const czarChipStyles: SxProps<Theme> = {
    height: 18,
    fontSize: '0.65rem',
    mt: 0.5,
};

export const statusContainerStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
};

export const getReadyIndicatorStyles = (isReady: boolean): SxProps<Theme> => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    bgcolor: isReady ? 'success.main' : 'rgba(255, 255, 255, 0.3)',
});

export const scoreStyles: SxProps<Theme> = {
    minWidth: 24,
    textAlign: 'right',
};

