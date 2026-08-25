import { Box, Typography, Paper, Avatar } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Player } from "../types";
import {
  containerStyles,
  titleStyles,
  listStyles,
  getPlayerItemStyles,
  playerInfoStyles,
  getAvatarStyles,
  youLabelStyles,
  statusContainerStyles,
  getReadyIndicatorStyles,
  scoreStyles,
} from "./PlayerList.styles";

interface PlayerListProps {
  players: Player[];
  currentPlayerId: string | null;
  cardCzarId?: string | null;
}

export const PlayerList = ({
  players,
  currentPlayerId,
  cardCzarId,
}: PlayerListProps) => {
  const { t } = useTranslation();

  return (
    <Paper sx={containerStyles}>
      <Typography variant="subtitle2" sx={titleStyles}>
        {t("players.playersCount", { count: players.length })}
      </Typography>

      <Box component="ul" sx={listStyles} role="list" aria-label={t("players.playersCount", { count: players.length })}>
        {players.map((player) => {
          const isCzar = player.id === cardCzarId;
          return (
            <Box
              component="li"
              key={player.id}
              sx={getPlayerItemStyles(player.id === currentPlayerId)}
            >
              <Box sx={playerInfoStyles}>
                <Avatar
                  sx={getAvatarStyles(isCzar)}
                >
                  {player.name.charAt(0).toUpperCase()}
                </Avatar>

                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {player.name}
                    {player.id === currentPlayerId && (
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={youLabelStyles}
                      >
                        {t("players.you")}
                      </Typography>
                    )}
                    {isCzar && (
                      <Typography
                        component="span"
                        variant="body2"
                        color="warning.main"
                        sx={youLabelStyles}
                      >
                        {t("players.czar")}
                      </Typography>
                    )}
                  </Typography>
                </Box>
              </Box>

              <Box sx={statusContainerStyles}>
                {!isCzar && (
                  <Box
                    sx={getReadyIndicatorStyles(player.isReady)}
                    aria-label={player.isReady ? t("players.ready") : t("players.notReady")}
                  />
                )}

                <Typography variant="body2" fontWeight={700} sx={scoreStyles}>
                  {player.score}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};
