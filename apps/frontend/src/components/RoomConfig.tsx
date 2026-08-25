import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Collapse,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faGlobe } from "@fortawesome/free-solid-svg-icons";
import type { Room } from "../types";
import { normalizeLanguage, type GameLanguage } from "../utils/detectLanguage";
import { changeAppLanguage } from "../i18n";
import {
  containerStyles,
  headerStyles,
  headerTitleStyles,
  contentStyles,
  formStyles,
  fieldStyles,
  buttonContainerStyles,
  submitButtonStyles,
  languageSectionStyles,
  languageLabelStyles,
} from "./RoomConfig.styles";

interface RoomConfigProps {
  room: Room | null;
  isAdmin: boolean;
  onConfigChange: (config: {
    numberOfrounds: number;
    maxPlayers: number;
    password?: string;
    playingTime: number;
    judgingTime: number;
    resultsTime: number;
    language?: string;
  }) => void;
}

export const RoomConfig = ({
  room,
  isAdmin,
  onConfigChange,
}: RoomConfigProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const [numberOfrounds, setNumberOfrounds] = useState(
    room?.configGame.numberOfrounds ?? 5,
  );
  const [maxPlayers, setMaxPlayers] = useState(
    room?.configGame.maxPlayers ?? 10,
  );
  const [password, setPassword] = useState(room?.configGame.password ?? "");
  const [playingTime, setPlayingTime] = useState(
    room?.configGame.playingTime ?? 60,
  );
  const [judgingTime, setJudgingTime] = useState(
    room?.configGame.judgingTime ?? 60,
  );
  const [resultsTime, setResultsTime] = useState(
    room?.configGame.resultsTime ?? 10,
  );
  const [language, setLanguage] = useState<GameLanguage>(
    normalizeLanguage(room?.configGame.language),
  );
  const [prevLanguage, setPrevLanguage] = useState(room?.configGame.language);

  const prevPhaseRef = useRef<string | undefined>(room?.gamePhase);

  useEffect(() => {
    const previousPhase = prevPhaseRef.current;
    const currentPhase = room?.gamePhase;
    if (previousPhase === "waiting" && currentPhase && currentPhase !== "waiting") {
      setOpen(false);
    }
    prevPhaseRef.current = currentPhase;
  }, [room?.gamePhase]);

  if (room?.configGame.language !== prevLanguage) {
    setPrevLanguage(room?.configGame.language);
    setLanguage(normalizeLanguage(room?.configGame.language));
  }

  const handleSubmit = () => {
    onConfigChange({
      numberOfrounds,
      maxPlayers,
      password: password || undefined,
      playingTime,
      judgingTime,
      resultsTime,
      language,
    });
  };

  const handleLanguageChange = (newLanguage: GameLanguage) => {
    setLanguage(newLanguage);
    changeAppLanguage(newLanguage);
    onConfigChange({
      numberOfrounds,
      maxPlayers,
      password: password || undefined,
      playingTime,
      judgingTime,
      resultsTime,
      language: newLanguage,
    });
  };

  return (
    <Paper sx={containerStyles}>
      <Box sx={headerStyles}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FontAwesomeIcon icon={faGear} size="sm" />
          <Typography variant="subtitle2" sx={headerTitleStyles}>
            {t("config.roomConfig")}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={
            open ? t("config.collapse") : t("config.expand")
          }
        >
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={open} timeout="auto">
        <Box sx={contentStyles}>
          {isAdmin ? (
            <Box sx={formStyles}>
              <Stack spacing={2}>
                <Box sx={languageSectionStyles}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <FontAwesomeIcon icon={faGlobe} size="xs" />
                    <Typography variant="caption" sx={languageLabelStyles}>
                      {t("common.language")}
                    </Typography>
                  </Box>
                  <ToggleButtonGroup
                    value={language}
                    exclusive
                    size="small"
                    fullWidth
                    disabled={room?.started ?? false}
                    onChange={(_, value: GameLanguage | null) => {
                      if (value) handleLanguageChange(value);
                    }}
                  >
                    <ToggleButton value="en">EN</ToggleButton>
                    <ToggleButton value="pt-br">PT-BR</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <TextField
                  label={t("config.numberOfRounds")}
                  type="number"
                  value={numberOfrounds}
                  onChange={(e) =>
                    setNumberOfrounds(
                      Math.max(1, parseInt(e.target.value) || 1),
                    )
                  }
                  inputProps={{ min: 1, max: 20 }}
                  size="small"
                  sx={fieldStyles}
                />

                <TextField
                  label={t("config.maxPlayers")}
                  type="number"
                  value={maxPlayers}
                  onChange={(e) =>
                    setMaxPlayers(Math.max(2, parseInt(e.target.value) || 2))
                  }
                  inputProps={{ min: 2, max: 20 }}
                  size="small"
                  sx={fieldStyles}
                />

                <TextField
                  label={t("config.playingTime")}
                  type="number"
                  value={playingTime}
                  onChange={(e) =>
                    setPlayingTime(
                      Math.max(10, parseInt(e.target.value) || 10),
                    )
                  }
                  inputProps={{ min: 10, max: 300 }}
                  size="small"
                  sx={fieldStyles}
                />

                <TextField
                  label={t("config.judgingTime")}
                  type="number"
                  value={judgingTime}
                  onChange={(e) =>
                    setJudgingTime(
                      Math.max(10, parseInt(e.target.value) || 10),
                    )
                  }
                  inputProps={{ min: 10, max: 300 }}
                  size="small"
                  sx={fieldStyles}
                />

                <TextField
                  label={t("config.resultsTime")}
                  type="number"
                  value={resultsTime}
                  onChange={(e) =>
                    setResultsTime(Math.max(5, parseInt(e.target.value) || 5))
                  }
                  inputProps={{ min: 5, max: 120 }}
                  size="small"
                  sx={fieldStyles}
                />

                <TextField
                  label={t("config.passwordOptional")}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("config.passwordPlaceholder")}
                  size="small"
                  sx={fieldStyles}
                />

                <Box sx={buttonContainerStyles}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleSubmit}
                    sx={submitButtonStyles}
                  >
                    {t("config.save")}
                  </Button>
                </Box>
              </Stack>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t("config.adminOnly")}
            </Typography>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};
