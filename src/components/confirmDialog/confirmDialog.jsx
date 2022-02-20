import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ConfirmDialog = ({
  title,
  message,
  onConfirm,
  labelConfirm,
  labelDismiss,
}) => {
  return confirmAlert({
    title,
    message,
    buttons: [
        {
            label: labelConfirm,
            onClick: () => onConfirm(),
        },
        {
            label: labelDismiss,
            onClick: () => null,
        }
    ]
  });
};

export default ConfirmDialog;
