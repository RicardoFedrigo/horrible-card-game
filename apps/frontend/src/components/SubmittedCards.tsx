import type { KeyboardEvent } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Card } from "./Card";
import type { Card as CardType } from "../types";
import {
  emptyStateStyles,
  titleStyles,
  gridStyles,
  getSubmissionCardStyles,
  revealedCardsContainerStyles,
  hiddenCardContainerStyles,
  hiddenCardStyles,
  hiddenCardTextStyles,
} from "./SubmittedCards.styles";

interface Submission {
  playerId: string;
  cards: CardType[];
}

interface SubmittedCardsProps {
  submissions: Submission[];
  onSelect?: (playerId: string) => void;
  isRevealed: boolean;
  isJudging?: boolean;
  hasVoted?: boolean;
}

export const SubmittedCards = ({
  submissions,
  onSelect,
  isRevealed,
  isJudging = false,
  hasVoted = false,
}: SubmittedCardsProps) => {
  const { t } = useTranslation();
  const canSelect = isJudging && onSelect && !hasVoted;

  const handleSelect = (playerId: string) => {
    if (canSelect) {
      onSelect(playerId);
    }
  };

  const handleKeyDown = (e: KeyboardEvent, playerId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(playerId);
    }
  };

  if (submissions.length === 0) {
    return (
      <Box sx={emptyStateStyles}>
        <Typography variant="body1" color="text.secondary">
          {t("game.waitingSubmit")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={titleStyles}>
        {canSelect
          ? t("game.votePrompt")
          : isJudging && hasVoted
            ? t("game.voteCounted")
            : isRevealed
              ? t("submitted.submittedCards")
              : t("submitted.playersSubmitted", { count: submissions.length })}
      </Typography>

      <Box
        sx={gridStyles}
        role={canSelect ? "listbox" : "list"}
        aria-label={t("submitted.submittedCards")}
      >
        {submissions.map((submission) => (
          <Paper
            key={submission.playerId}
            role={canSelect ? "option" : "listitem"}
            tabIndex={canSelect ? 0 : -1}
            aria-selected={false}
            onClick={() => handleSelect(submission.playerId)}
            onKeyDown={(e) => handleKeyDown(e, submission.playerId)}
            sx={getSubmissionCardStyles({
              isRevealed,
              isSelected: false,
            })}
          >
            {isRevealed ? (
              <Box sx={revealedCardsContainerStyles}>
                {submission.cards.map((card) => (
                  <Card key={card.id} card={card} size="sm" />
                ))}
              </Box>
            ) : (
              <Box sx={hiddenCardContainerStyles}>
                <Paper elevation={4} sx={hiddenCardStyles}>
                  <Typography sx={hiddenCardTextStyles}>HCG</Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
};
