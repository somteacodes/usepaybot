import { message } from "telegraf/filters";
import { countAllTasks } from "../service/userService";

const infoMessage = (name: string = "") => `
<b>
    Welcome ${name} to the <i>Use Pay</i> Testing group
</b>
<i>Use Pay</i> is a proposal for a more secure way to use USSD peer-to-peer transactions.
To get started, <strong>generate</strong> or <strong>view</strong> your letter.
Use the <code>/letter</code> command.

You can also use the <code>/help</code> command to see a list of available commands.

<i>I am not the fastest bot out there, so bear with me if it takes me some time to respond.</i>
`;

const helpMessage = () => `
Hi there! I am the <b>Use Pay Test</b> bot.
I am here to help you with your tasks.

Here are some commands you can use to interact with me:

<b>Available Commands</b>

- /info - View this welcome message

- /letter - Generate or view your unique letter

- /help - View this help message

- /tasks - View all tasks

- /match - View or get a new match to send money to <b>(Task 5 only)</b>

- /vouchermatch - View or get a new match to send a voucher to <b>(Task 7 only)</b>

You can type any of the commands above to get started or tap on them to execute the command.

<i>PS: I am not the fastest bot out there, so bear with me if it takes me some time to respond.</i>

<b>Need More Help?</b>
`;

const viewAllTasks = async (): Promise<string> => {
  const taskLength = await countAllTasks();
  let message = `There are ${taskLength} tasks available. \n\nUse the following commands to view a specific task: \n\n`;
  for (let i = 1; i <= taskLength; i++) {
    message += `Task ${i} - /task${i} \n\n`;
  }
  message += `<i>PS: I am not the fastest bot out there, so bear with me if it takes me some time to respond.</i>`;
  return message;
};

export { infoMessage, helpMessage, viewAllTasks };
