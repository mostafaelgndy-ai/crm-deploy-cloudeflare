"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface DeleteConfirmProps {
  /** Name of the item being deleted (shown in the message). */
  title: string;
  /** Called when the user types "confirm" and clicks DELETE FOREVER. */
  onConfirm: () => void;
  /** Called when the user cancels or closes the modal. */
  onCancel: () => void;
}

/**
 * Delete confirmation modal — requires typing "confirm" to proceed.
 */
export function DeleteConfirm({ title, onConfirm, onCancel }: DeleteConfirmProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleConfirm = () => {
    if (value.trim() !== "confirm") {
      setError(true);
      return;
    }
    onConfirm();
  };

  return (
    <Modal onClose={onCancel}>
      <h2 className="font-display text-xl font-bold mb-2 text-red">Delete permanently?</h2>
      <p className="text-sm text-muted mb-4 leading-relaxed">
        This removes <span className="text-[#EDEFF3] font-medium">{title}</span> from the database completely. This can't be undone.
      </p>
      <p className="field-label mb-1.5">
        Type <span className="text-red">confirm</span> to continue
      </p>
      <input
        type="text"
        placeholder="confirm"
        className="mb-2"
        autoComplete="off"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError(false);
        }}
        autoFocus
      />
      {error && (
        <p className="text-sm text-red mb-2">Type the word "confirm" exactly to delete.</p>
      )}
      <div className="flex justify-end gap-2 pt-3">
        <Button variant="panel" onClick={onCancel}>
          CANCEL
        </Button>
        <Button variant="red" onClick={handleConfirm}>
          DELETE FOREVER
        </Button>
      </div>
    </Modal>
  );
}