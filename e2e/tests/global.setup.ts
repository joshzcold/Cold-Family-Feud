import { exec } from "child_process";
import { promisify } from "util";
import { test as setup } from "@playwright/test";

const execAsync = promisify(exec);

setup("docker", async () => {
  const maxRetries = 60;
  const waitSeconds = 1;

  for (let i = 0; i < maxRetries; i++) {
    try {
      // Get status of all running containers
      const { stdout } = await execAsync('docker ps --format "{{.Names}}  {{.Status}}"');

      // Regex patterns to extract container name and health status
      // "famf-backend-1  Up 4 minutes (healthy)"
      const nameRegex = /^[^\s]+/; // "famf-backend-1"
      const statusRegex = /(healthy|unhealthy|starting)/i; // "healthy"

      // Boolean filter to exclude empty strings
      const containers = stdout
        .split("\n")
        .filter(Boolean)
        .map((container) => {
          const nameMatch = container.match(nameRegex);
          const statusMatch = container.match(statusRegex);

          if (!nameMatch?.[0] || !statusMatch?.[1]) {
            // Exclude the act containers from the error
            if (!container.includes("act-")) {
              throw new Error(`Failed to parse container info: ${container}`);
            }
            return null;
          }

          const name = nameMatch[0];
          const status = statusMatch[1];

          return {
            name,
            status,
          };
        })
        .filter(Boolean);

      // Check if all required containers are healthy
      // These container names must be substrings of the actual container names
      // e.g. 'frontend' will match 'famf-frontend-1'
      const requiredContainers = ["backend", "frontend", "proxy"];
      const containerStatuses = requiredContainers.map((name) => ({
        name,
        isHealthy: containers.find((c) => c?.name.includes(name))?.status === "healthy" ?? false,
      }));

      const allHealthy = containerStatuses.every((c) => c.isHealthy);
      if (allHealthy) {
        return;
      }

      console.log(`Waiting for containers to be healthy ${i + 1}/${maxRetries}`);
      await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
    } catch (err) {
      console.log(`Error checking container health ${i + 1}/${maxRetries}:`, err);
      await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
    }
  }

  throw new Error("containers failed to become healthy");
});
