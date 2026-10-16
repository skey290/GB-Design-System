"use client";

import * as React from "react";
import { Globe, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { PartInput } from "@/components/ui/part-input";
import { Select, type SelectOption } from "@/components/ui/select";

import styles from "./input.module.css";

/** Figma `Input` — a composite Textfield/Upload/Select/Link block. See docs/components/input.md for the spec. */
export interface InputProps {
  /** Title shown at the top of the block. Hidden if an empty string/undefined */
  label?: string;
  /** Help text shown at the bottom of the block. Hidden if an empty string/undefined */
  description?: string;

  /** Whether to show the Textfield row */
  showTextfield?: boolean;
  /** Value of the Textfield row (controlled) */
  textfieldValue?: string;
  /** Called when the Textfield row's value changes */
  onTextfieldValueChange?: (value: string) => void;
  /** Placeholder for the Textfield row */
  textfieldPlaceholder?: string;

  /** Whether to show the Upload row */
  showUpload?: boolean;
  /** Selected file (controlled) */
  file?: File | null;
  /** Called when the file selection changes */
  onFileChange?: (file: File | null) => void;
  /** Text shown in the Upload row when there's no file */
  uploadPlaceholder?: string;
  /** `accept` attribute for the native `<input type="file">` */
  accept?: string;

  /** Whether to show the Select row. Not rendered if `selectOptions` is empty */
  showSelect?: boolean;
  /** Options shown in the Select row. The row isn't rendered if empty */
  selectOptions?: SelectOption[];
  /** Selected value of the Select row (controlled) */
  selectValue?: string;
  /** Called when the Select row's value changes */
  onSelectValueChange?: (value: string) => void;
  /** Text shown in the Select row when there's no value */
  selectPlaceholder?: string;

  /** Whether to show the Link row */
  showLink?: boolean;
  /** Value of the Link row (controlled) */
  linkValue?: string;
  /** Called when the Link row's value changes */
  onLinkValueChange?: (value: string) => void;
  /** Placeholder for the Link row */
  linkPlaceholder?: string;

  /** Merged onto the root `<div>` */
  className?: string;
}

export function Input({
  label = "File Upload",
  description = "The uploaded image will be used to generate your base brand kit.",

  showTextfield = true,
  textfieldValue,
  onTextfieldValueChange,
  textfieldPlaceholder = "Email or Username",

  showUpload = true,
  file = null,
  onFileChange,
  uploadPlaceholder = "File upload",
  accept,

  showSelect = true,
  selectOptions,
  selectValue,
  onSelectValueChange,
  selectPlaceholder = "MBTI",

  showLink = true,
  linkValue,
  onLinkValueChange,
  linkPlaceholder = "https://gabrielle.ai",

  className,
}: InputProps) {
  const fileInputId = React.useId();
  const labelId = React.useId();

  return (
    <div className={className ? `${styles.root} ${className}` : styles.root}>
      {label ? (
        <p id={labelId} className={cn("text-sm-semi-bold", styles.label)}>
          {label}
        </p>
      ) : null}

      {showTextfield ? (
        <PartInput
          showTrailingIcon={false}
          value={textfieldValue}
          onValueChange={onTextfieldValueChange}
          placeholder={textfieldPlaceholder}
          className={styles.fieldFull}
        />
      ) : null}

      {showUpload ? (
        <label
          htmlFor={fileInputId}
          data-filled={file != null}
          className={styles.uploadLabel}
        >
          <span className={styles.uploadLabelText}>
            {file ? file.name : uploadPlaceholder}
          </span>
          <Plus className={styles.uploadIcon} aria-hidden="true" />
          <input
            id={fileInputId}
            type="file"
            accept={accept}
            aria-labelledby={label ? labelId : undefined}
            aria-label={label ? undefined : uploadPlaceholder}
            className={styles.srOnly}
            onChange={(event) =>
              onFileChange?.(event.target.files?.[0] ?? null)
            }
          />
        </label>
      ) : null}

      {showSelect && selectOptions?.length ? (
        <Select
          variant="primary"
          options={selectOptions}
          value={selectValue}
          onValueChange={onSelectValueChange}
          placeholder={selectPlaceholder}
          className={styles.fieldFull}
        />
      ) : null}

      {showLink ? (
        <PartInput
          type="url"
          value={linkValue}
          onValueChange={onLinkValueChange}
          placeholder={linkPlaceholder}
          showTrailingIcon
          icon={Globe}
          className={styles.fieldFull}
        />
      ) : null}

      {description ? (
        <p className={cn("text-xs-medium", styles.description)}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
