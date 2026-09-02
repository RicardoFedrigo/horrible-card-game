import { Box, Typography, Paper, Chip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import type { Card as CardType } from '../types';
import {
  sizeStyles,
  getCardStyles,
  cardTextStyles,
  cardFooterStyles,
  cardLogoStyles,
  pickChipStyles,
  selectedIndicatorStyles,
  checkIconStyles,
} from './Card.styles';

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
}

export const Card = ({ 
  card, 
  isSelected = false, 
  isDisabled = false,
  onClick,
  size = 'md',
  hideText = false,
}: CardProps) => {
  const { t } = useTranslation();
  const isBlack = card.cardType === 'black';
  const styles = sizeStyles[size];

  const handleClick = () => {
    if (isDisabled || !onClick) return;
    onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Paper
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={
        isBlack
          ? t('card.blackCard', { text: card.text })
          : t('card.whiteCard', { text: card.text })
      }
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      elevation={isSelected ? 8 : 4}
      sx={getCardStyles({
        isBlack,
        isSelected,
        isDisabled,
        hasOnClick: !!onClick,
        size,
      })}
    >
      <Typography variant="body1" sx={cardTextStyles(styles.fontSize)}>
        {hideText ? '' : card.text}
      </Typography>
      
      <Box sx={cardFooterStyles}>
        <Typography variant="caption" sx={cardLogoStyles}>
          CAH
        </Typography>
        {isBlack && card.pick && card.pick > 1 && (
          <Chip
            label={t('card.pick', { count: card.pick })}
            size="small"
            sx={pickChipStyles}
          />
        )}
      </Box>

      {isSelected && (
        <Box sx={selectedIndicatorStyles}>
          <CheckIcon sx={checkIconStyles} />
        </Box>
      )}
    </Paper>
  );
};
