import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Onboarding } from "@/components/Onboarding";
import { Tutorial } from "@/components/Tutorial";
import { HabitDashboard } from "@/components/HabitDashboard";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { TutorialButton } from "@/components/TutorialButton";
import { GardenNameDialog } from "@/components/GardenNameDialog";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { NotificationPermissionDialog, useNotificationPermissionPrompt } from "@/components/NotificationPermissionDialog";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const { data: userPrefs, isLoading } = useUserPreferences();
	const [showTutorial, setShowTutorial] = useState(false);
	const [showGardenNameDialog, setShowGardenNameDialog] = useState(false);
	const { shouldShow: showNotificationPrompt, setShouldShow: setShowNotificationPrompt } = useNotificationPermissionPrompt();

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900">
				<div className="text-center">
					<div className="mb-4 text-2xl">🌱</div>
					<p className="text-gray-600 dark:text-gray-300">Loading...</p>
				</div>
			</div>
		);
	}

	if (!userPrefs?.hasCompletedOnboarding) {
		return <Onboarding onComplete={() => window.location.reload()} />;
	}

	// Show garden name dialog if user hasn't set a garden name yet
	const needsGardenName = !userPrefs?.gardenName;
	const shouldShowTutorial = !userPrefs?.hasCompletedTutorial || showTutorial;

	return (
		<>
			<HabitDashboard />
			<DarkModeToggle />
			<TutorialButton onClick={() => setShowTutorial(true)} />

			{/* Garden Name Dialog - shows first time after onboarding */}
			{needsGardenName && !shouldShowTutorial && (
				<GardenNameDialog
					open={needsGardenName && !showGardenNameDialog}
					onOpenChange={() => {}}
					onComplete={() => window.location.reload()}
				/>
			)}

			{shouldShowTutorial && (
				<Tutorial onComplete={() => {
					setShowTutorial(false);
					window.location.reload();
				}} />
			)}
			{/* Notification Permission Dialog */}
			<NotificationPermissionDialog
				open={showNotificationPrompt}
				onOpenChange={setShowNotificationPrompt}
			/>
		</>
	);
}
