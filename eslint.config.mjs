import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([...nextVitals, globalIgnores([".next/**", "node_modules/**"]), { rules: { "react/no-unescaped-entities": "off" } }]);
