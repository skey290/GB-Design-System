import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import styles from "./detail-view.module.css";

export interface DetailViewProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** "Continue with Google" 버튼 클릭 시 호출됩니다 */
  onContinueWithGoogle: () => void;
}

export const DetailView = React.forwardRef<HTMLDivElement, DetailViewProps>(
  function DetailView({ onContinueWithGoogle, className, ...props }, ref) {
    return (
      <div ref={ref} className={cn(styles.root, className)} {...props}>
        <div className={styles.imageWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/onboarding/pixelated-human.png"
            alt=""
            aria-hidden="true"
            className={styles.image}
          />
        </div>

        <div className={styles.welcomeBlock}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="Gabrielle" className={styles.logo} />
          <p className={styles.lightText}>
            Welcome to Gabrielle, an agent for your personal branding.
          </p>
        </div>

        <div className={styles.googleBlock}>
          <div className={styles.googleInner}>
            <Button
              variant="google"
              className={styles.googleButton}
              onClick={onContinueWithGoogle}
            />
            <p className={styles.googleCaption}>
              Sign up or Log in using Google account.
            </p>
          </div>
        </div>
      </div>
    );
  },
);
