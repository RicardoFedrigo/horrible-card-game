import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useSocket } from "../hooks/useSocket";
import {
  pageContainerStyles,
  decorativeCircle1Styles,
  decorativeCircle2Styles,
  logoContainerStyles,
  titleStyles,
  subtitleStyles,
  connectionStatusStyles,
  getConnectionIconStyles,
  cardContainerStyles,
  formPaperStyles,
  tabsStyles,
  alertStyles,
  textFieldStyles,
  buttonStyles,
  loadingContainerStyles,
  roomCodeInputStyles,
  floatingCard1Styles,
  floatingCard2Styles,
  footerStyles,
} from "./Home.styles";
import { randomAlphaNumeric } from "../utils/randomAlhpaNumeric";
import {
  detectLanguage,
  getLocaleLanguage,
  type GameLanguage,
} from "../utils/detectLanguage";
import { changeAppLanguage } from "../i18n";

export const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { createRoom, joinRoom, room, error, isConnected } = useSocket();

  const [activeTab, setActiveTab] = useState<number>(0);
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState<GameLanguage>(getLocaleLanguage);

  useEffect(() => {
    let mounted = true;
    detectLanguage().then((detected) => {
      if (mounted) {
        setLanguage(detected);
        changeAppLanguage(detected);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (room?.codeRoom) {
      navigate({ to: "/game/$code", params: { code: room.codeRoom } });
    }
  }, [room?.codeRoom, navigate]);

  useEffect(() => {
    if (!isLoading) return;
    if (room?.codeRoom || error) {
      window.setTimeout(() => setIsLoading(false), 0);
    }
  }, [isLoading, room?.codeRoom, error]);

  const handleCreateRoom = () => {
    if (!playerName.trim()) return;
    setIsLoading(true);
    createRoom(
      playerName.trim(),
      randomAlphaNumeric(6),
      password.trim(),
      language,
    );
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    setIsLoading(true);
    joinRoom(roomCode.trim().toUpperCase(), playerName.trim(), password.trim());
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    }
  };

  const handleLanguageChange = (value: GameLanguage) => {
    setLanguage(value);
    changeAppLanguage(value);
  };

  return (
    <Box sx={pageContainerStyles}>
      {/* Decorative elements */}
      <Box sx={decorativeCircle1Styles} />
      <Box sx={decorativeCircle2Styles} />

      {/* Logo & Title */}
      <Container maxWidth="sm" sx={logoContainerStyles}>
        <Typography variant="h1" sx={titleStyles}>
          <Box component="span" sx={{ color: "primary.main" }}>
            CARDS
          </Box>
          <br />
          <Box component="span" sx={{ color: "secondary.main" }}>
            AGAINST
          </Box>
          <br />
          <Box component="span" sx={{ color: "primary.main" }}>
            HUMANITY
          </Box>
        </Typography>

        <Typography variant="body1" sx={subtitleStyles}>
          {t("home.subtitle")}
        </Typography>

        {/* Connection status */}
        <Box sx={connectionStatusStyles}>
          <FiberManualRecordIcon sx={getConnectionIconStyles(isConnected)} />
          <Typography variant="caption" color="text.secondary">
            {isConnected ? t("common.connected") : t("common.disconnected")}
          </Typography>
        </Box>
      </Container>

      {/* Card Container */}
      <Container maxWidth="sm" sx={cardContainerStyles}>
        <Paper elevation={8} sx={formPaperStyles}>
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={tabsStyles}
          >
            <Tab label={t("home.createRoom")} />
            <Tab label={t("home.joinRoom")} />
          </Tabs>

          {/* Error display */}
          {error && (
            <Alert severity="error" sx={alertStyles}>
              {error}
            </Alert>
          )}

          {/* Player Name Input (shared) */}
          <TextField
            fullWidth
            label={t("home.yourName")}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder={t("home.namePlaceholder")}
            inputProps={{ maxLength: 20 }}
            sx={textFieldStyles}
            disabled={isLoading}
          />

          <TextField
            fullWidth
            label={t("home.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("home.passwordPlaceholder")}
            slotProps={{
              htmlInput: {
                maxLength: 6,
                style: roomCodeInputStyles,
              },
            }}
            sx={textFieldStyles}
          />

          {/* Create Room Panel */}
          {activeTab === 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <FontAwesomeIcon icon={faGlobe} size="xs" />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {t("common.language")}
                  </Typography>
                </Box>
                <ToggleButtonGroup
                  value={language}
                  exclusive
                  size="small"
                  fullWidth
                  onChange={(_, value: GameLanguage | null) => {
                    if (value) handleLanguageChange(value);
                  }}
                >
                  <ToggleButton value="en">EN</ToggleButton>
                  <ToggleButton value="pt-br">PT-BR</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={!playerName.trim() || isLoading || !isConnected}
                onClick={handleCreateRoom}
                onKeyDown={(e) => handleKeyDown(e, handleCreateRoom)}
                sx={buttonStyles}
              >
                {isLoading ? (
                  <Box sx={loadingContainerStyles}>
                    <CircularProgress size={20} color="inherit" />
                    {t("home.creating")}
                  </Box>
                ) : (
                  t("home.createNewRoom")
                )}
              </Button>
            </>
          )}

          {/* Join Room Panel */}
          {activeTab === 1 && (
            <>
              <TextField
                fullWidth
                label={t("home.roomCode")}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder={t("home.roomCodePlaceholder")}
                inputProps={{
                  maxLength: 6,
                  style: roomCodeInputStyles,
                }}
                sx={textFieldStyles}
              />

              <Button
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                disabled={
                  !playerName.trim() ||
                  !roomCode.trim() ||
                  isLoading ||
                  !isConnected
                }
                onClick={handleJoinRoom}
                onKeyDown={(e) => handleKeyDown(e, handleJoinRoom)}
                sx={buttonStyles}
              >
                {isLoading ? (
                  <Box sx={loadingContainerStyles}>
                    <CircularProgress size={20} color="inherit" />
                    {t("home.joining")}
                  </Box>
                ) : (
                  t("home.joinRoom")
                )}
              </Button>
            </>
          )}
        </Paper>

        {/* Floating cards decoration */}
        <Paper sx={floatingCard1Styles} />
        <Paper sx={floatingCard2Styles} />
      </Container>

      {/* Footer */}
      <Typography variant="body2" color="text.secondary" sx={footerStyles}>
        {t("home.footer")}
      </Typography>
    </Box>
  );
};
