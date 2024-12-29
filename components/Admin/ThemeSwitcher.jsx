import { Palette } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ThemeSwitcher = ({game, setGame, send}) => {
    const { t } = useTranslation();
    const THEME_STORAGE_KEY = "theme";

    const availableThemes = {
        default: {
            bgcolor: "white",
            fgcolor: "text-black",
            title: "default",
        },
        darkTheme: {
            bgcolor: "#18181B",
            fgcolor: "text-white",
            title: "dark theme",
        },
        slate: {
            bgcolor: "#18181B",
            fgcolor: "text-white",
            title: "slate",
        },
        educational: {
            bgcolor: "#fffbf0",
            fgcolor: "text-black",
            title: "educational",
        },
        red: {
            bgcolor: "#7B2C35",
            fgcolor: "text-white",
            title: "red",
        },
    };
 
    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if(savedTheme && availableThemes[savedTheme] && game.settings.theme !== savedTheme) {
            handleThemeChange(savedTheme);
        }
    }, [])

    const handleThemeChange = (newTheme) => {
        try {
            // Save to localStorage first
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);

            // Create deep copy of game state
            const updatedGame = JSON.parse(JSON.stringify(game));
            updatedGame.settings.theme = newTheme;

            // Update local state
            setGame(updatedGame);

            // Send update to server
            send({ 
                action: "data", 
                data: updatedGame,
                callback: (success) => {
                    if (!success) {
                        console.error('Failed to update theme on server');
                        // Revert localStorage if server update failed
                        localStorage.setItem(THEME_STORAGE_KEY, game.settings.theme);
                    }
                }
            });
        } catch (error) {
            console.error('Error updating theme:', error);
            // Revert localStorage on error
            localStorage.setItem(THEME_STORAGE_KEY, game.settings.theme);
        }
    } 

    return (         
    <div className="flex flex-row space-x-5 items-center">
        <Palette color="gray" />
        <select
            className="bg-secondary-300 text-foreground rounded-lg p-2"
            value={game.settings.theme}
            onChange={(e) => handleThemeChange(e.target.value)}
            aria-label={t("Select theme")}
        >
            {Object.keys(availableThemes).map((key) => (
                <option
                    value={key}
                    key={`theme-${key}`}
                    style={{
                        backgroundColor: availableThemes[key].bgcolor
                    }}
                    className={`${availableThemes[key].fgcolor}`}
                >
                    {availableThemes[key].title}
                </option>
            ))}
        </select>
    </div> 
    );
}
 
export default ThemeSwitcher;