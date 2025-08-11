import { ErrorInfo, PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button, Stack, Typography } from "@mui/material";

const Fallback = () => {
  const handleClick = () => {
    window.location.href = "/";
  };
  return (
    <Stack direction="column" spacing={2} alignItems="flex-start">
      <Typography>
        Something went wrong! We already collected the error and soon working on
        this! Sorry for any inconvenience!
      </Typography>
      <Button onClick={handleClick} variant="contained">
        Back to home page
      </Button>
    </Stack>
  );
};

const handleError = (error: Error, info: ErrorInfo) => {
  // Send log to Sentry or something
  console.error(error, info);
};

export const ErrorBoundaryProvider = ({ children }: PropsWithChildren) => {
  return (
    <ErrorBoundary fallback={<Fallback />} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};
