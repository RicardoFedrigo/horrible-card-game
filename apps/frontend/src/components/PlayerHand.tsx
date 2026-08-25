import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Card } from './Card';
import type { Card as CardType } from '../types';
import {
  containerStyles,
  headerStyles,
  cardsContainerStyles,
  cardWrapperStyles,
} from './PlayerHand.styles';

interface PlayerHandProps {
  cards: CardType[];
  selectedCardIds: string[];
  onCardSelect: (cardId: string) => void;
  maxSelections?: number;
  isDisabled?: boolean;
}

export const PlayerHand = ({
  cards,
  selectedCardIds,
  onCardSelect,
  maxSelections = 1,
  isDisabled = false,
}: PlayerHandProps) => {
  const { t } = useTranslation();

  const handleCardClick = (cardId: string) => {
    if (isDisabled) return;
    onCardSelect(cardId);
  };

  return (
    <Box sx={containerStyles}>
      <Box sx={headerStyles}>
        <Typography variant="h6" fontWeight={700}>
          {t('hand.yourHand')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('hand.selected', { selected: selectedCardIds.length, max: maxSelections })}
        </Typography>
      </Box>
      
      <Box 
        sx={cardsContainerStyles}
        role="listbox"
        aria-label={t('hand.yourHand')}
        aria-multiselectable={maxSelections > 1}
      >
        {cards.map((card) => (
          <Box key={card.id} sx={cardWrapperStyles}>
            <Card
              card={card}
              isSelected={selectedCardIds.includes(card.id)}
              isDisabled={isDisabled || (selectedCardIds.length >= maxSelections && !selectedCardIds.includes(card.id))}
              onClick={() => handleCardClick(card.id)}
              size="md"
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
