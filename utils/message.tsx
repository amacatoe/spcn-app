import { showMessage, hideMessage } from "react-native-flash-message";

export function topSuccessMessage(text: string) {
  showMessage({
    message: text,
    type: 'success',
    position: 'top',
  });
}

export function topDangerMessage(text: string) {
  showMessage({
    message: text,
    type: 'danger',
    position: 'top',
  });
}

export function topWarningMessage(text: string) {
  showMessage({
    message: text,
    type: 'warning',
    position: 'top',
  });
}

export function centerSuccessMessage(text: string) {
  showMessage({
    message: text,
    type: 'success',
    position: 'center',
  });
}

export function centerDangerMessage(text: string) {
  showMessage({
    message: text,
    type: 'danger',
    position: 'center',
  });
}

export function centerWarningMessage(text: string) {
  showMessage({
    message: text,
    type: 'warning',
    position: 'center',
  });
}