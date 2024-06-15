import React from "react";

interface SuccessFeedbackProps {
  message: string;
  description?: string;
  action?: React.ReactNode;
  show: boolean;
}
export default function SuccessFeedback({message, description, action, show}: SuccessFeedbackProps) {
  if (!show) return <></>;
  return (
    <div className="bg-green-200 p-4 rounded-md text-green-700 mb-2">
      <p className="font-bold">{message}</p>
      {description && <p>{description}</p>}
      {action && action}
    </div>
  );
}
