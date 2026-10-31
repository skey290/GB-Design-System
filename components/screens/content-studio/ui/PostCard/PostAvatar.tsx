import { cn } from "@/lib/utils";
import { Icon } from "@/lib/sprite-icon";

import { PLATFORM_ICONS, type PostPlatform } from "./post";

export type PostAvatarPlatform = PostPlatform | "universal";

export interface PostAvatarProps {
  socialMedia: PostAvatarPlatform;
  /** Accounts connected for this platform. 0 (default) = no badge, 1 = platform-logo badge, 2+ = "+N" count badge (N = connectedAccounts - 1) */
  connectedAccounts?: number;
  /** "self" shows the connected account's photo (`src`); "logo" shows the Gabrielle placeholder mark */
  type?: "self" | "logo";
  src?: string;
  alt?: string;
}

/** Figma `Part/post avatar` — 56px avatar with a platform badge overlapping its bottom-right corner. */
export function PostAvatar({
  socialMedia,
  connectedAccounts = 0,
  type = "self",
  src,
  alt = "",
}: PostAvatarProps) {
  const isCircle = socialMedia !== "universal" && socialMedia !== "linkedin";
  const showBadge = socialMedia !== "universal" && connectedAccounts >= 1;
  const showCount = connectedAccounts >= 2;

  return (
    <div className="relative h-[56px] w-[56px] shrink-0">
      <div
        className={cn(
          "h-full w-full overflow-hidden",
          isCircle
            ? "rounded-[var(--gb-radius-scale-full)]"
            : "rounded-[var(--gb-radius-scale-none)]",
        )}
      >
        {type === "logo" ? (
          <div className="flex h-full w-full items-center justify-center bg-[var(--gb-background-bolder)]">
            <span className="text-xxs-bold tracking-[0.05em] text-[var(--gb-text-invert)]">
              GABRIELLE
            </span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        )}
      </div>

      {showBadge && (
        <span
          className={cn(
            "absolute -right-[5px] -bottom-[5px] flex h-5 items-center justify-center rounded-[var(--gb-radius-scale-full)]",
            "border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-bolder)] bg-[var(--gb-background-default)]",
            showCount ? "px-[var(--gb-spacing-1-5)]" : "w-5",
          )}
        >
          {showCount ? (
            <span className="text-xs-medium text-[var(--gb-text-default)]">
              +{connectedAccounts - 1}
            </span>
          ) : (
            <Icon
              id={PLATFORM_ICONS[socialMedia as PostPlatform]}
              className="size-[10px]"
            />
          )}
        </span>
      )}
    </div>
  );
}
