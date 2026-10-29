"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";

import styles from "./input-form.module.css";

/** Figma `InputForm` — a composite Textfield/Upload/Select/Link block. See docs/components/input-form.md for the spec. */
export interface InputFormProps {
  /** Title shown at the top of the block. Hidden if an empty string/undefined */
  title?: string;
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

  /** Stretches to fill the parent instead of its fixed 320px width. Default false */
  shouldFitContainer?: boolean;
  /** Merged onto the root `<div>` */
  className?: string;
}

export function InputForm({
  title = "File Upload",
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

  shouldFitContainer = false,
  className,
}: InputFormProps) {
  const fileInputId = React.useId();
  const titleId = React.useId();

  return (
    <div
      data-fit-container={shouldFitContainer || undefined}
      className={className ? `${styles.root} ${className}` : styles.root}
    >
      {title ? (
        <p id={titleId} className={cn("text-sm-semi-bold", styles.title)}>
          {title}
        </p>
      ) : null}

      {showTextfield ? (
        <Input
          value={textfieldValue}
          onValueChange={onTextfieldValueChange}
          placeholder={textfieldPlaceholder}
          className={styles.fieldFull}
        />
      ) : null}

      {showUpload ? (
        <Input
          type="upload"
          id={fileInputId}
          file={file}
          onFileChange={onFileChange}
          accept={accept}
          placeholder={uploadPlaceholder}
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : uploadPlaceholder}
          className={styles.fieldFull}
        />
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
        <Input
          type="link"
          inputType="url"
          value={linkValue}
          onValueChange={onLinkValueChange}
          placeholder={linkPlaceholder}
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
