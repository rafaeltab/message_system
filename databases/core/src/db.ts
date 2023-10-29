#!/usr/bin/env node

import { backup } from "./commands/backup.js";
import { migrate } from "./commands/migrate.js";
import { preview } from "./commands/preview.js";
import { restore } from "./commands/restore.js";
import { setup } from "./commands/setup.js";

switch(process.argv[2]) {
    case "migrate":
        await migrate();
        break;
    case "setup":
        await setup();
        break;
    case "preview":
        await preview();
        break;
    case "backup":
        await backup();
        break;
    case "restore":
        await restore();
        break;
}
