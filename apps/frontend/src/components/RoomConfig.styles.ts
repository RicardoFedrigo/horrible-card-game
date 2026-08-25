import type { SxProps, Theme } from "@mui/material";

export const containerStyles: SxProps<Theme> = {
  bgcolor: "rgba(42, 42, 42, 0.5)",
  p: 2,
  borderRadius: 3,
};

export const headerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export const headerTitleStyles: SxProps<Theme> = {
  color: "text.secondary",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

export const contentStyles: SxProps<Theme> = {
  mt: 2,
};

export const languageSectionStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
};

export const languageLabelStyles: SxProps<Theme> = {
  color: "text.secondary",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

export const formStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export const fieldStyles: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    color: "text.primary",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
};

export const buttonContainerStyles: SxProps<Theme> = {
  display: "flex",
  gap: 1,
  mt: 1,
};

export const submitButtonStyles: SxProps<Theme> = {
  flex: 1,
};
