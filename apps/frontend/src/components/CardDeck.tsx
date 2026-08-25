import { Box, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  deckContainerStyles,
  getStackedCardStyles,
  getTopCardStyles,
  deckLogoStyles,
  deckLabelStyles,
  deckCountStyles,
} from './CardDeck.styles';

interface CardDeckProps {
  type: 'black' | 'white';
  count?: number;
}

export const CardDeck = ({ type, count = 50 }: CardDeckProps) => {
  const { t } = useTranslation();
  const isBlack = type === 'black';
  const stackCount = Math.min(5, Math.ceil(count / 10));
  
  return (
    <Box 
      sx={deckContainerStyles}
      role="img"
      aria-label={`${isBlack ? t('deck.questions') : t('deck.answers')} - ${t('deck.cardsCount', { count })}`}
    >
      {/* Stacked cards effect */}
      {[...Array(stackCount)].map((_, i) => (
        <Paper
          key={i}
          elevation={2}
          sx={getStackedCardStyles(isBlack, i)}
        />
      ))}
      
      {/* Top card with CAH logo */}
      <Paper elevation={4} sx={getTopCardStyles(isBlack)}>
        <Typography variant="h4" sx={deckLogoStyles}>
          CAH
        </Typography>
        <Typography variant="caption" sx={deckLabelStyles}>
          {isBlack ? t('deck.questions') : t('deck.answers')}
        </Typography>
        {count > 0 && (
          <Typography variant="body2" sx={deckCountStyles}>
            {t('deck.cardsCount', { count })}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};
