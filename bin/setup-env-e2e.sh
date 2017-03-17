echo "Setting up environment for e2e tests"

echo "* The working directory is: $(pwd)"

echo "[1] Transform into a plugin"
if [ ! -f "./themeisle-sdk.php" ]; then
  cp ./bin/themeisle-sdk.php ./
else
  echo "[Skip] The plugin file already exists"
fi

echo "[2] Activate Visualizer tracking"
npm run wp-env run tests-cli wp option set visualizer_logger_flag "yes"

echo "[3] Install plugins"
npm run wp-env run tests-cli wp plugin install visualizer
npm run wp-env run tests-cli wp plugin activate visualizer

echo "[4] Activate SDK as plugin"
npm run wp-env run tests-cli wp plugin activate themeisle-sdk