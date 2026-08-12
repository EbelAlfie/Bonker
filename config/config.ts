import "dotenv/config"

export const Config = {
    TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN ?? "",
    GIT_REMOTE_TOKEN: process.env.GIT_REMOTE_TOKEN ?? "",
    REPO_URL: process.env.TARGET_REPO ?? ""
}