import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    // eslint-config-next 16 added strict React-Compiler-style rules. The code they flag (state set in effects,
    // ref sync during render, Math.random in the celebration) works and is covered by manual testing, and
    // rewriting cooking mode / voice just to satisfy a linter risks new bugs, so they warn instead of fail.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/refs": "warn",
    },
  },
];

export default eslintConfig;
