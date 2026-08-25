import type { SxProps, Theme } from '@mui/material';

export const pageContainerStyles: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
};

export const appBarStyles: SxProps<Theme> = {
  borderBottom: '1px solid rgba(255,255,255,0.1)',
};

export const logoStyles: SxProps<Theme> = {
  fontFamily: '"Archivo Black", sans-serif',
};

export const dividerStyles: SxProps<Theme> = {
  mx: 2,
  borderColor: 'rgba(255,255,255,0.2)',
};

export const roomCodeStyles: SxProps<Theme> = {
  fontFamily: 'monospace',
  color: 'text.primary',
  letterSpacing: '0.1em',
};

export const headerRightStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 2,
};

export const toolbarStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
};

export const headerLeftStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
};

export const headerPhaseStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

export const connectionStatusStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
};

export const getConnectionIconStyles = (isConnected: boolean): SxProps<Theme> => ({
  fontSize: 10,
  color: isConnected ? 'success.main' : 'secondary.main',
});

export const connectionTextStyles: SxProps<Theme> = {
  display: { xs: 'none', sm: 'block' },
};

export const alertStyles: SxProps<Theme> = {
  borderRadius: 0,
};

export const mainContentStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: { xs: 'column', lg: 'row' },
};

export const sidebarStyles: SxProps<Theme> = {
  width: { xs: '100%', lg: 288 },
  bgcolor: 'rgba(22, 32, 25, 0.6)',
  borderRight: { lg: '1px solid rgba(230, 224, 200, 0.12)' },
  borderBottom: { xs: '1px solid rgba(230, 224, 200, 0.12)', lg: 'none' },
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export const phasePaperStyles: SxProps<Theme> = {
  p: 2,
  bgcolor: 'rgba(42, 42, 42, 0.3)',
};

export const phaseLabelStyles: SxProps<Theme> = {
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};

export const phaseValueStyles: SxProps<Theme> = {
  mt: 0.5,
  textTransform: 'capitalize',
};

export const gameAreaStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  p: { xs: 2, lg: 3 },
};

// Waiting Phase Styles
export const waitingContainerStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

export const waitingHeaderStyles: SxProps<Theme> = {
  textAlign: 'center',
  mb: 4,
};

export const decksContainerStyles: SxProps<Theme> = {
  display: 'flex',
  gap: 4,
  mb: 4,
};

export const buttonsContainerStyles: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
};

export const readyButtonStyles: SxProps<Theme> = {
  minWidth: 150,
};

export const minPlayersTextStyles: SxProps<Theme> = {
  mt: 2,
};

export const roomCodeCardStyles: SxProps<Theme> = {
  mb: 4,
  px: 5,
  py: 3,
  textAlign: 'center',
  bgcolor: 'rgba(26, 36, 29, 0.7)',
  border: '1px solid rgba(230, 224, 200, 0.1)',
  borderRadius: 3,
};

export const roomCodeLabelStyles: SxProps<Theme> = {
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'text.secondary',
};

export const roomCodeValueStyles: SxProps<Theme> = {
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '0.25em',
  color: 'primary.main',
  my: 0.5,
  wordBreak: 'break-all',
};

// Playing Phase Styles
export const playingContainerStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

export const cardsAreaStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: { xs: 'column', lg: 'row' },
  gap: 3,
  mb: 3,
};

export const blackCardSectionStyles: SxProps<Theme> = {
  width: { lg: '33%' },
};

export const questionLabelStyles: SxProps<Theme> = {
  mb: 1.5,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};

export const questionContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  px: 2,
  py: 3,
  mb: 3,
};

export const questionTextStyles: SxProps<Theme> = {
  maxWidth: 720,
  lineHeight: 1.3,
};

export const submissionsSectionStyles: SxProps<Theme> = {
  flex: 1,
};

export const confirmButtonContainerStyles: SxProps<Theme> = {
  mt: 2,
  display: 'flex',
  justifyContent: 'center',
};

export const playerHandSectionStyles: SxProps<Theme> = {
  borderTop: '1px solid rgba(255,255,255,0.1)',
  pt: 3,
};

export const submitButtonContainerStyles: SxProps<Theme> = {
  mt: 2,
  display: 'flex',
  justifyContent: 'center',
};

export const deckPileRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: 3,
  mb: 3,
  alignItems: 'stretch',
};

export const deckSectionStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

export const deckSectionLabelStyles: SxProps<Theme> = {
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

export const pileSectionStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

export const pileCardStyles: SxProps<Theme> = {
  px: 3,
  py: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 144,
  bgcolor: 'rgba(20, 28, 22, 0.7)',
  border: '1px solid rgba(230, 224, 200, 0.1)',
};

// Card Czar Styles
export const czarSectionStyles: SxProps<Theme> = {
  borderTop: '1px solid rgba(255,255,255,0.1)',
  pt: 3,
  textAlign: 'center',
};

export const czarPaperStyles: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  px: 3,
  py: 2,
  bgcolor: 'rgba(255, 51, 51, 0.1)',
  border: '1px solid rgba(255, 51, 51, 0.3)',
};

export const czarChipStyles: SxProps<Theme> = {
  bgcolor: 'secondary.main',
  fontSize: '1.25rem',
};

export const czarTextContainerStyles: SxProps<Theme> = {
  textAlign: 'left',
};

// Results Phase Styles
export const resultsContainerStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

export const winnerNameStyles: SxProps<Theme> = {
  mb: 4,
};

// Game Ended Styles
export const endedContainerStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

export const finalWinnerStyles: SxProps<Theme> = {
  mb: 4,
};

