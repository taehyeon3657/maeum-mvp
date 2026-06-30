import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const platform = process.env.EAS_BUILD_PLATFORM;
const isEasBuild = process.env.EAS_BUILD === "true";

const files = [
  {
    platform: "android",
    env: "GOOGLE_SERVICES_JSON",
    destination: "google-services.json",
  },
  {
    platform: "ios",
    env: "GOOGLE_SERVICE_INFO_PLIST",
    destination: "GoogleService-Info.plist",
  },
];

function shouldPrepare(targetPlatform) {
  return !platform || platform === "all" || platform === targetPlatform;
}

function prepareFile({ env, destination }) {
  const destinationPath = path.join(projectRoot, destination);
  const sourcePath = process.env[env];

  if (sourcePath) {
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`${env} points to a missing file: ${sourcePath}`);
    }

    fs.copyFileSync(sourcePath, destinationPath);
    console.log(`Created ${destination} from ${env}.`);
    return;
  }

  if (fs.existsSync(destinationPath)) {
    console.log(`${destination} already exists.`);
    return;
  }

  if (isEasBuild) {
    throw new Error(
      `${destination} is missing. Set ${env} as an EAS file environment variable.`
    );
  }
}

for (const file of files) {
  if (shouldPrepare(file.platform)) {
    prepareFile(file);
  }
}
