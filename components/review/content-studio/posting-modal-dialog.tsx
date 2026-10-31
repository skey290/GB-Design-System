"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import {
  PostingModal,
  type PostingModalEmptyProps,
} from "@/components/content-studio/ui/PostingModal";
import dialogStyles from "@/components/ui/dialog/dialog.module.css";

import styles from "./posting-modal-dialog.module.css";

export interface PostingModalDialogProps extends Omit<
  PostingModalEmptyProps,
  "style"
> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * PostingModal(`style="empty"`)을 생성 플로우 모달로 띄우는 래퍼. PostingModal이
 * 이미 자체 border/padding/배경/바깥쪽(-47px) 닫기버튼을 가진 완전한 카드라
 * 공용 DialogContent(고정폭 min(90vw,560px) + 자체 padding)로 감싸면 테두리가
 * 겹치고 폭이 깨진다 — Radix 원형으로 오버레이+중앙정렬만 제공한다.
 */
export function PostingModalDialog({
  open,
  onOpenChange,
  ...postingModalProps
}: PostingModalDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <div className="dark">
          <DialogPrimitive.Overlay className={dialogStyles.overlay} />
          <DialogPrimitive.Content className={styles.content}>
            <PostingModal
              style="empty"
              className="light"
              {...postingModalProps}
            />
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
