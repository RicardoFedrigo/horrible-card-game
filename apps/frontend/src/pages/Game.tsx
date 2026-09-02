import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Button,
  Paper,
  AppBar,
  Toolbar,
  Divider,
  Alert,
  Fade,
  Grow,
  Collapse,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import LogoutIcon from "@mui/icons-material/Logout";
import TimerIcon from "@mui/icons-material/Timer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useSocket } from "../hooks/useSocket";
import { Card } from "../components/Card";
import { CardDeck } from "../components/CardDeck";
import { PlayerHand } from "../components/PlayerHand";
import { PlayerList } from "../components/PlayerList";
import { SubmittedCards } from "../components/SubmittedCards";
import { RoomConfig } from "../components/RoomConfig";
import { useGameStore } from "../store/useGameStore";
import { normalizeLanguage } from "../utils/detectLanguage";
import { changeAppLanguage } from "../i18n";

import {
  pageContainerStyles,
  appBarStyles,
  logoStyles,
  dividerStyles,
  roomCodeStyles,
  headerRightStyles,
  toolbarStyles,
  headerLeftStyles,
  headerPhaseStyles,
  connectionStatusStyles,
  getConnectionIconStyles,
  connectionTextStyles,
  alertStyles,
  mainContentStyles,
  sidebarStyles,
  gameAreaStyles,
  waitingContainerStyles,
  waitingHeaderStyles,
  decksContainerStyles,
  buttonsContainerStyles,
  readyButtonStyles,
  minPlayersTextStyles,
  roomCodeCardStyles,
  roomCodeLabelStyles,
  roomCodeValueStyles,
  playingContainerStyles,
  deckPileRowStyles,
  deckSectionStyles,
  deckSectionLabelStyles,
  questionContainerStyles,
  questionTextStyles,
  submissionsSectionStyles,
  playerHandSectionStyles,
  submitButtonContainerStyles,
  resultsContainerStyles,
  winnerNameStyles,
  endedContainerStyles,
} from "./Game.styles";

const MIN_PLAYERS = 2;
const ERROR_DISMISS_MS = 5000;

export const GamePage = () => {
  const { t } = useTranslation();
  const params = useParams({ strict: false });
  const code = String(params.code ?? "");
  const navigate = useNavigate();
  const {
    room,
    player,
    isConnected,
    error,
    lobbyMessages,
    timerRemaining,
    setReady,
    startGame,
    submitCards,
    selectWinner,
    leaveRoom,
    backToLobby,
    configureRoom,
  } = useSocket();

  const roundHistory = useGameStore((state) => state.roundHistory);
  const setError = useGameStore((state) => state.setError);
  const winnerMessage = useGameStore((state) => state.winnerMessage);
  const roomPassword = useGameStore((state) => state.roomPassword);

  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const roomCode = room?.codeRoom ?? code;

  const currentPlayer = useMemo(() => {
    return room?.players.find((p) => p.id === player?.id);
  }, [room, player]);

  const isAdmin = currentPlayer?.isAdmin ?? false;

  const currentPlayerId = player?.id ?? "";

  const currentBlackCard = room?.currentBlackCard ?? null;
  const gamePhase = room?.gamePhase ?? "waiting";
  const players = room?.players ?? [];
  const submissions = room?.submittedCards ?? [];
  const cardCzarId = room?.cardCzarId ?? null;
  const votes = room?.votes ?? [];
  const tiebreakActive = room?.tiebreakActive ?? false;

  // Auto-dismiss errors
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), ERROR_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [error, setError]);

  const allPlayersReady =
    players.length > 0 && players.every((p) => p.status === "ready");
  const maxSelections = currentBlackCard?.pick ?? 1;
  const playerHand = currentPlayer?.cardsInHand ?? [];
  const deckCount = room?.deckCount ?? 50;

  const hasVoted = votes.some((v) => v.voterPlayerId === currentPlayerId);

  const language = normalizeLanguage(room?.configGame.language);
  const languageLabel = language === "pt-br" ? "PT-BR" : "EN";

  useEffect(() => {
    changeAppLanguage(language);
  }, [language]);

  const winnerIds =
    gamePhase === "results"
      ? room?.winningPlayerIds ??
        (room?.winningPlayerId ? [room.winningPlayerId] : [])
      : [];

  const isUrgent =
    gamePhase === "playing" &&
    !hasSubmitted &&
    timerRemaining !== null &&
    timerRemaining <= 10;

  const handleCardSelect = (cardId: string) => {
    if (hasSubmitted) return;

    setSelectedCardIds((prev) => {
      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId);
      }
      if (prev.length >= maxSelections) {
        return [...prev.slice(1), cardId];
      }
      return [...prev, cardId];
    });
  };

  const handleReady = () => {
    if (!room) return;
    setReady();
  };

  const handleStartGame = () => {
    if (room) {
      startGame();
    }
  };

  const handleSubmitCards = () => {
    if (selectedCardIds.length !== maxSelections || !room) return;

    submitCards(selectedCardIds);
    setHasSubmitted(true);

    setSelectedCardIds([]);
  };

  const handleSelectWinner = (playerId: string) => {
    if (hasVoted || !room) return;

    selectWinner(playerId);
  };

  const handleLeaveRoom = () => {
    if (room) {
      leaveRoom();
    }
    navigate({ to: "/home" });
  };

  const handleBackToLobby = () => {
    backToLobby();
  };

  const copyToClipboard = (text: string): boolean => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => {
        setError(t("game.copyError"));
      });
      return true;
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (!successful) {
        setError(t("game.copyError"));
        return false;
      }
      return true;
    } catch {
      setError(t("game.copyError"));
      return false;
    }
  };

  const handleCopyCode = () => {
    if (!roomCode) return;
    if (copyToClipboard(roomCode)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  // Reset states when new round starts
  useEffect(() => {
    if (room?.gamePhase === "playing") {
      navigate({ to: "/game/$code", params: { code: room.codeRoom } });
      window.setTimeout(() => {
        setHasSubmitted(false);
        setSelectedCardIds([]);
        useGameStore.getState().setSubmissionConfirmed(false);
      }, 0);
    }
  }, [navigate, room?.codeRoom, room?.currentRound, room?.gamePhase]);

  const phaseLabel =
    gamePhase === "waiting"
      ? t("game.lobby")
      : gamePhase === "playing"
        ? t("game.playing")
        : gamePhase === "judging"
          ? t("game.judging")
          : gamePhase === "results"
            ? t("game.results")
            : gamePhase === "ended"
              ? t("game.gameOver")
              : gamePhase;

  return (
    <Box
      sx={{
        ...pageContainerStyles,
        animation: isUrgent ? "screen-shake 0.3s linear infinite" : "none",
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={appBarStyles}
      >
        <Toolbar sx={toolbarStyles}>
          <Box sx={headerLeftStyles}>
            <Typography variant="h6" sx={logoStyles}>
              CAH
            </Typography>

            <Divider orientation="vertical" flexItem sx={dividerStyles} />

            <Typography variant="body2" color="text.secondary">
              {t("game.room")}:{" "}
              <Box component="span" sx={roomCodeStyles}>
                {code}
              </Box>
            </Typography>

            {roomPassword && (
              <Typography variant="body2" color="text.secondary">
                {t("home.password")}:{" "}
                <Box component="span" sx={roomCodeStyles}>
                  {roomPassword}
                </Box>
              </Typography>
            )}
          </Box>

          <Box sx={headerPhaseStyles}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor:
                  gamePhase === "playing"
                    ? "info.main"
                    : gamePhase === "judging"
                      ? "warning.main"
                      : gamePhase === "results"
                        ? "success.main"
                        : gamePhase === "ended"
                          ? "secondary.main"
                          : "text.secondary",
              }}
            />
            <Typography variant="subtitle1" fontWeight={700}>
              {phaseLabel}
            </Typography>
          </Box>

          <Box sx={headerRightStyles}>
            <Box sx={connectionStatusStyles}>
              <FiberManualRecordIcon
                sx={getConnectionIconStyles(isConnected)}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={connectionTextStyles}
              >
                {isConnected ? t("common.connected") : t("common.disconnected")}
              </Typography>
            </Box>

            <Button
              color="secondary"
              startIcon={<LogoutIcon />}
              onClick={handleLeaveRoom}
              size="small"
            >
              {t("common.leave")}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Error display - auto-dismissing */}
      {error && (
        <Alert severity="error" sx={alertStyles}>
          {error}
        </Alert>
      )}

      {/* Main content */}
      <Box sx={mainContentStyles}>
        {/* Sidebar - Players */}
        <Box sx={sidebarStyles}>
          <PlayerList
            players={players}
            currentPlayerId={currentPlayerId}
            cardCzarId={cardCzarId}
          />

          {isAdmin && (
            <RoomConfig
              room={room}
              isAdmin={isAdmin}
              onConfigChange={configureRoom}
            />
          )}
        </Box>

        {/* Game area */}
        <Box sx={gameAreaStyles}>
          {/* Waiting phase */}
          {gamePhase === "waiting" && (
            <Grow in timeout={700}>
              <Box sx={waitingContainerStyles}>
              <Box sx={waitingHeaderStyles}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {t("game.waitingForPlayers")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {allPlayersReady ? t("game.allReady") : t("game.waitForReady")}
                </Typography>
              </Box>

              <Paper sx={roomCodeCardStyles}>
                <Typography variant="body2" sx={roomCodeLabelStyles}>
                  {t("home.roomCode")}
                </Typography>
                <Typography variant="h2" sx={roomCodeValueStyles}>
                  {roomCode}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyCode}
                >
                  {copied ? t("game.copied") : t("game.copy")}
                </Button>
                <Box
                  sx={{
                    mt: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                  }}
                >
                  <FontAwesomeIcon icon={faGlobe} size="xs" />
                  <Typography variant="caption" color="text.secondary">
                    {t("common.language")}:
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {languageLabel}
                  </Typography>
                </Box>
              </Paper>

              <Box sx={decksContainerStyles}>
                <CardDeck type="black" />
                <CardDeck type="white" />
              </Box>

              <Box sx={buttonsContainerStyles}>
                <Button
                  variant="contained"
                  color={
                    currentPlayer?.status === "ready" ? "success" : "primary"
                  }
                  size="large"
                  onClick={handleReady}
                  sx={readyButtonStyles}
                >
                  {currentPlayer?.status === "ready"
                    ? t("game.readyDone")
                    : t("game.ready")}
                </Button>

                {isAdmin &&
                  allPlayersReady &&
                  players.length >= MIN_PLAYERS && (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={handleStartGame}
                    >
                      {t("game.startGame")}
                    </Button>
                  )}
              </Box>

              {lobbyMessages.length > 0 && (
                <Paper
                  elevation={2}
                  sx={{ mt: 3, p: 2, width: "100%", maxWidth: 560 }}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      mb: 1,
                    }}
                  >
                    {t("game.lobbyActivity")}
                  </Typography>
                  {lobbyMessages.map((message, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      sx={{ mb: index !== lobbyMessages.length - 1 ? 1 : 0 }}
                    >
                      {message}
                    </Typography>
                  ))}
                </Paper>
              )}

              {players.length < MIN_PLAYERS && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={minPlayersTextStyles}
                >
                  {t("game.needPlayers", { count: MIN_PLAYERS })}
                </Typography>
              )}
              </Box>
            </Grow>
          )}

          {/* Playing/Judging/Results phase */}
          <Fade in key={gamePhase} timeout={{ enter: 700, exit: 0 }}>
            <Box>
              {(gamePhase === "playing" ||
                gamePhase === "judging" ||
                gamePhase === "results") &&
                currentBlackCard && (
                  <Box sx={playingContainerStyles}>
                    {/* Timer */}
                    {timerRemaining !== null && (
                      <Box
                        sx={{
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <TimerIcon
                          sx={{
                            color:
                              timerRemaining <= 10
                                ? "error.main"
                                : "primary.main",
                            fontSize: 28,
                          }}
                        />
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          sx={{
                            color:
                              timerRemaining <= 10 ? "error.main" : "inherit",
                          }}
                        >
                          {t("game.time", { count: timerRemaining })}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={deckPileRowStyles}>
                      <Box sx={deckSectionStyles}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={deckSectionLabelStyles}
                        >
                          {t("game.deck")}
                        </Typography>
                        <CardDeck type="black" count={deckCount} />
                      </Box>
                    </Box>

                    {/* Question - centered plain text */}
                    <Box sx={questionContainerStyles}>
                      <Typography variant="h4" fontWeight={700} sx={questionTextStyles}>
                        {currentBlackCard.text}
                      </Typography>
                      {maxSelections > 1 && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {t("game.pickCards", { count: maxSelections })}
                        </Typography>
                      )}
                    </Box>

                    {/* Submissions - show during playing/judging only */}
                    {gamePhase !== "results" && (
                      <Box sx={submissionsSectionStyles}>
                        <SubmittedCards
                          submissions={submissions}
                          isRevealed={gamePhase === "judging"}
                          onSelect={
                            gamePhase === "judging"
                              ? handleSelectWinner
                              : undefined
                          }
                          isJudging={gamePhase === "judging"}
                          hasVoted={hasVoted && gamePhase === "judging"}
                        />
                      </Box>
                    )}

                    {/* Player hand - during playing phase */}
                    {gamePhase === "playing" && (
                      <Box sx={playerHandSectionStyles}>
                        <PlayerHand
                          cards={playerHand}
                          selectedCardIds={selectedCardIds}
                          onCardSelect={handleCardSelect}
                          maxSelections={maxSelections}
                          isDisabled={hasSubmitted}
                        />

                        <Box sx={submitButtonContainerStyles}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={
                              selectedCardIds.length !== maxSelections ||
                              hasSubmitted
                            }
                            onClick={handleSubmitCards}
                          >
                            {hasSubmitted
                              ? t("game.submitted")
                              : maxSelections === 1
                                ? t("game.submitCard")
                                : t("game.submitCards")}
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {/* Judging info */}
                    {gamePhase === "judging" && (
                      <Box
                        sx={{
                          borderTop: "1px solid rgba(255,255,255,0.1)",
                          pt: 3,
                          textAlign: "center",
                        }}
                      >
                        <Paper
                          sx={{
                            p: 2,
                            display: "inline-block",
                            bgcolor: "rgba(255, 255, 255, 0.05)",
                          }}
                        >
                          {tiebreakActive && (
                            <Typography
                              variant="body1"
                              fontWeight={700}
                              color="warning.main"
                              sx={{ mb: 0.5 }}
                            >
                              {t("game.tiebreak")}
                            </Typography>
                          )}
                          <Typography variant="body1" fontWeight={700}>
                            {hasVoted ? t("game.voteCounted") : t("game.votePrompt")}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t("game.votedCount", {
                              count: votes.length,
                              total: players.length,
                            })}
                          </Typography>
                        </Paper>
                      </Box>
                    )}
                  </Box>
                )}
            </Box>
          </Fade>

          {/* Results phase */}
          {gamePhase === "results" && (
            <Grow in timeout={750}>
              <Box sx={resultsContainerStyles}>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                {winnerIds.length > 1
                  ? t("game.roundWinners")
                  : t("game.roundWinner")}
              </Typography>
              <Typography
                variant="h5"
                color="success.main"
                sx={winnerNameStyles}
              >
                {winnerIds.length > 1
                  ? winnerIds
                      .map((id) => players.find((p) => p.id === id)?.name)
                      .filter(Boolean)
                      .join(" & ")
                  : players.find((p) => p.id === winnerIds[0])?.name ??
                    "Unknown"}
              </Typography>
              {winnerIds.length > 1 && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {t("game.tie")}
                </Typography>
              )}

              {/* Black card + winning answer */}
              {currentBlackCard && (
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {t("game.winningAnswer")}
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    textAlign="center"
                    sx={questionTextStyles}
                  >
                    {currentBlackCard.text}
                  </Typography>
                  {winnerIds.map((id) => {
                    const winningSubmission = submissions.find(
                      (s) => s.playerId === id,
                    );
                    return winningSubmission?.cards.map((card) => (
                      <Typography
                        key={card.id}
                        variant="h5"
                        fontWeight={700}
                        textAlign="center"
                        color="success.main"
                        sx={{
                          maxWidth: 720,
                          animation: "answer-wind 0.9s ease both",
                        }}
                      >
                        {card.text}
                      </Typography>
                    ));
                  })}
                </Box>
              )}

              {timerRemaining !== null && (
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  <TimerIcon
                    sx={{
                      color:
                        timerRemaining <= 10 ? "error.main" : "primary.main",
                      fontSize: 28,
                    }}
                  />
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                      color:
                        timerRemaining <= 10 ? "error.main" : "inherit",
                    }}
                  >
                    {t("game.nextRound", { count: timerRemaining })}
                  </Typography>
                </Box>
              )}
              <Typography variant="body1" color="text.secondary">
                {t("game.nextRoundSoon")}
              </Typography>
              </Box>
            </Grow>
          )}

          {/* Game ended phase */}
          {gamePhase === "ended" && (
            <Grow in timeout={800}>
              <Box sx={endedContainerStyles}>
              <Typography variant="h2" fontWeight={700} gutterBottom>
                {t("game.gameOver")}
              </Typography>

              {winnerMessage && (
                <Typography
                  variant="h4"
                  color="warning.main"
                  sx={{
                    mt: 2,
                    fontStyle: "italic",
                    maxWidth: 760,
                    textAlign: "center",
                    lineHeight: 1.25,
                  }}
                >
                  {winnerMessage}
                </Typography>
              )}

              {/* Round history */}
              {roundHistory.length > 0 && (
                <Box sx={{ mt: 4, width: "100%", maxWidth: 600 }}>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => setShowHistory((prev) => !prev)}
                    sx={{ mb: 2 }}
                  >
                    {showHistory
                      ? t("game.hideHistory")
                      : t("game.showHistory")}
                  </Button>
                  <Collapse in={showHistory}>
                    <Box>
                      {roundHistory.map((record) => (
                        <Paper
                          key={record.round}
                          sx={{
                            p: 2,
                            mb: 1,
                            bgcolor: "rgba(255, 255, 255, 0.05)",
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="body2" fontWeight={700}>
                            {t("game.roundWinnerLabel", {
                              round: record.round,
                              name: record.winnerName,
                            })}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mb: 1 }}
                          >
                            {record.blackCard.text}
                          </Typography>
                          <Box
                            sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                          >
                            {record.winningCards.map((c) => (
                              <Box key={c.id} sx={{ maxWidth: 200 }}>
                                <Card card={c} size="sm" />
                              </Box>
                            ))}
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              )}

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleBackToLobby}
                >
                  {t("game.backToLobby")}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={handleLeaveRoom}
                >
                  {t("game.backHome")}
                </Button>
              </Box>
              </Box>
            </Grow>
          )}
        </Box>
      </Box>
    </Box>
  );
};
