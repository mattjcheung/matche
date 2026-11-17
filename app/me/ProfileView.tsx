"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Button } from "@/components";
import styles from "./ProfileView.module.css";

/**
 * "View as public" state for the profile page. The owner can preview what
 * other travellers see; owner-only controls hide while it's on.
 */
interface ProfileViewState {
  publicView: boolean;
  togglePublic: () => void;
}

const ProfileViewContext = createContext<ProfileViewState>({ publicView: false, togglePublic: () => {} });

export function useProfileView() {
  return useContext(ProfileViewContext);
}

export function ProfileViewProvider({ children }: { children: ReactNode }) {
  const [publicView, setPublicView] = useState(false);
  return (
    <ProfileViewContext.Provider value={{ publicView, togglePublic: () => setPublicView((v) => !v) }}>
      {children}
    </ProfileViewContext.Provider>
  );
}

/** Dark strip under the header while previewing the public profile. */
export function PublicBanner() {
  const { publicView, togglePublic } = useProfileView();
  if (!publicView) return null;
  return (
    <div className={styles.banner}>
      <div className={styles.bannerInner}>
        <p className={styles.bannerText}>You’re seeing your profile the way other travellers see it.</p>
        <Button variant="inverse" size="md" className={styles.bannerButton} onClick={togglePublic}>
          Back to my view
        </Button>
      </div>
    </div>
  );
}

/** "View as public" / "Back to my view" toggle in the profile header. */
export function PublicToggle() {
  const { publicView, togglePublic } = useProfileView();
  return (
    <Button variant="secondary" className={styles.toggle} aria-pressed={publicView} onClick={togglePublic}>
      {publicView ? "Back to my view" : "View as public"}
    </Button>
  );
}

/** Renders children only in the owner's own view. */
export function OwnerOnly({ children }: { children: ReactNode }) {
  const { publicView } = useProfileView();
  return publicView ? null : <>{children}</>;
}
