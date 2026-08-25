import type { SxProps, Theme } from '@mui/material';

export const containerStyles: SxProps<Theme> = {
    width: '100%',
};

export const headerStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
};

export const cardsContainerStyles: SxProps<Theme> = {
    display: 'flex',
    gap: 2,
    overflowX: 'auto',
    pb: 2,
    px: 1,
    mx: -1,
    '&::-webkit-scrollbar': {
        height: 8,
    },
    '&::-webkit-scrollbar-track': {
        bgcolor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
        bgcolor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 4,
        '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.3)',
        },
    },
};

export const cardWrapperStyles: SxProps<Theme> = {
    flexShrink: 0,
    transition: 'all 0.3s ease',
    animation: 'card-deal 0.45s ease both',
};

