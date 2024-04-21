import { useEffect, useState } from "react";
import Portal from "@mui/material/Portal";
import Alert from "@mui/material/Alert";

import { errorBus } from "~/utils/errorBus";

const portalContainer = document.createElement("div");
portalContainer.style.position = "fixed";
portalContainer.style.top = "50%";
portalContainer.style.left = "50%";
portalContainer.style.transform = "translate(-50%, -50%)";
portalContainer.style.zIndex = "999999";

document.body.appendChild(portalContainer);

export const ApiErrorHandler = () => {
  const [error, setError] = useState<Error>();

  useEffect(() => {
    errorBus.subscribe(setError as () => void);
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(undefined);
      }, 1500);
    }
  }, [error]);

  return error ? (
    <Portal container={portalContainer}>
      <Alert severity="error">{error.toString()}</Alert>
    </Portal>
  ) : null;
};
