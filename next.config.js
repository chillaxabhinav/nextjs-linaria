const BABEL_LOADER_STRING = "babel/loader";
const makeLinariaLoaderConfig = babelOptions => ({
  loader: require.resolve("@linaria/webpack-loader"),
  options: {
    sourceMap: true,
    extension: ".linaria.module.css",
    babelOptions: Object.keys(babelOptions).reduce((opt, key) => {
      if(["isServer",
      "distDir",
      "pagesDir",
      "development",
      "hasReactRefresh",
      "hasJsxRuntime"].includes(key)) {
        return opt;
      }
      opt[key] = babelOptions[key];
      return opt;
    }, {})
  },
});

let injectedBabelLoader = false;
function crossRules(rules, parentRule) {
  for (const rule of rules) {
    if (typeof rule.loader === "string" && rule.loader.includes("css-loader")) {
      if (rule.options && rule.options.modules && typeof rule.options.modules.getLocalIdent === "function") {
        rule.options.modules.auto = true;
      }
    }

    if (typeof rule.use === "object") {
      if (Array.isArray(rule.use)) {
        const babelLoaderIndex = rule.use.findIndex(
          ({ loader }) => typeof loader === "string" && loader.includes(BABEL_LOADER_STRING)
        );

        const babelLoaderItem = rule.use[babelLoaderIndex];

        if (babelLoaderIndex !== -1) {
          rule.use = [
            ...rule.use.slice(0, babelLoaderIndex),
            babelLoaderItem,
            makeLinariaLoaderConfig(babelLoaderItem.options),
            ...rule.use.slice(babelLoaderIndex + 2),
          ];
          injectedBabelLoader = true;
        }
      } else if (typeof rule.use.loader === "string" && rule.use.loader.includes(BABEL_LOADER_STRING)) {
        rule.use = [rule.use, makeLinariaLoaderConfig(rule.use.options)];
        injectedBabelLoader = true;
      }

      crossRules(Array.isArray(rule.use) ? rule.use : [rule.use], rule);
    }

    if (Array.isArray(rule.oneOf)) {
      crossRules(rule.oneOf, rule);
    }
  }
}

function withLinaria(nextConfig = {}) {
  return {
    ...nextConfig,
    webpack(config, options) {
      crossRules(config.module.rules);

      if (!injectedBabelLoader) {
        config.module.rules.push({
          test: /\.(tsx?|jsx?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: linariaWebpackLoaderConfig.options.babelOptions,
            },
            linariaWebpackLoaderConfig,
          ],
        });
      }

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  };
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withLinaria(nextConfig);