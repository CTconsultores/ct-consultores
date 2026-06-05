"use client";

import { useEffect, useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import LoginScreen from "@/components/LoginScreen";
import OnboardingScreen from "@/components/OnboardingScreen";
import ProfileCreatedScreen from "@/components/ProfileCreatedScreen";
import DashboardScreen from "@/components/DashboardScreen";
import { getSession, getUser } from "@/lib/storage";

type Screen = "welcome" | "login" | "onboarding" | "created" | "dashboard";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [activeUser, setActiveUser] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");

  useEffect(() => {
    const session = getSession();
    if (session && getUser(session)) {
      setActiveUser(session);
      setScreen("dashboard");
    }
  }, []);

  function handleOnboardingComplete(username: string) {
    setNewUsername(username);
    setScreen("created");
  }

  function handleGoToDashboard() {
    setActiveUser(newUsername);
    setScreen("dashboard");
  }

  function handleLoginSuccess(username: string) {
    setActiveUser(username);
    setScreen("dashboard");
  }

  function handleLogout() {
    setActiveUser("");
    setScreen("welcome");
  }

  return (
    <main>
      {screen === "welcome" && (
        <WelcomeScreen
          onLogin={() => setScreen("login")}
          onOnboarding={() => setScreen("onboarding")}
        />
      )}
      {screen === "login" && (
        <LoginScreen
          onSuccess={handleLoginSuccess}
          onBack={() => setScreen("welcome")}
          onOnboarding={() => setScreen("onboarding")}
        />
      )}
      {screen === "onboarding" && (
        <OnboardingScreen
          onComplete={handleOnboardingComplete}
          onBack={() => setScreen("welcome")}
        />
      )}
      {screen === "created" && (
        <ProfileCreatedScreen
          username={newUsername}
          onGoToDashboard={handleGoToDashboard}
        />
      )}
      {screen === "dashboard" && (
        <DashboardScreen
          username={activeUser}
          onLogout={handleLogout}
        />
      )}
    </main>
  );
}
