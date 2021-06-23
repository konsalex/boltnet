if ! command -v yarn &> /dev/null
then
    echo "Yarn does not exist, installing"
    npm install -g yarn
fi