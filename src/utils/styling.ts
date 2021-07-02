import chalk from 'chalk';

export const greenMessage = (message: string) => {
  console.log(chalk.black.bgGreen(message));
};

export const redMessage = (message: string) => {
  console.log(chalk.black.bgRed(message));
};

export const yellowGappedMessage = (message: string) => {
  const chalked = chalk.black.bgYellow(message);
  console.log(chalked.padStart(chalked.length + 8));
};
