import { message } from "telegraf/filters";
import dotenv from "dotenv";
import { Telegraf, session } from "telegraf";

import { helpMessage, infoMessage, viewAllTasks } from "./design/messages";

import {
  addToTransactionTable,
  addToVoucherMatchTable,
  findMyMatch,
  getNumbersAfterIs,
  getOrCreateUser,
  getRecentUserMatchDetails,
  getTaskByNumber,
  getUserDetails,
  matchToNewUser,
} from "./service/userService";
import { InlineKeyboard } from "grammy";
import { createClient } from "redis";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!, {});
bot.use(session());
bot.command("info", (ctx) => {
  // get the user's chat id
  const firstName = ctx.from.first_name;
  ctx.reply(infoMessage(firstName), { parse_mode: "HTML" });
});

bot.command("letter", async (ctx) => {
  console.log("chatId", ctx.from.id.toString());
  const userLetter = await getOrCreateUser(ctx.from.id.toString());
  // ctx.reply(
  //   `Hello @${ctx.from.first_name}, your unique letter is ${userLetter}`,
  //   { parse_mode: "HTML" }
  // );
  ctx.sendMessage(`Hi, your unique letter is <strong> ${userLetter}</strong>`, {
    parse_mode: "HTML",
    reply_parameters: {
      message_id: ctx.message.message_id,
    },
  });
});

bot.command("help", (ctx) => {
  ctx.reply(helpMessage(), {
    parse_mode: "HTML",
    reply_markup: helpMenu,
  });
});

//  show all tasks commands
bot.command("tasks", async (ctx) => {
  ctx.reply(await viewAllTasks(), { parse_mode: "HTML" });
});

bot.command("task1", async (ctx) => {
  const taskDetails = await getTaskByNumber(1);
  if (!taskDetails) {
    ctx.reply("Task 1 not found");
    return;
  } else {
    ctx.reply(taskDetails?.instruction!, {
      parse_mode: "HTML",
    });
  }
});

bot.command("task2", async (ctx) => {
  const taskDetails = await getTaskByNumber(2);
  if (!taskDetails) {
    ctx.reply("Task 2 not found");
    return;
  } else {
    ctx.reply(taskDetails?.instruction!, {
      parse_mode: "HTML",
    });
  }
});
bot.command("task3", async (ctx) => {
  const taskDetails = await getTaskByNumber(3);
  if (!taskDetails) {
    ctx.reply("Task 3 not found");
    return;
  } else {
    ctx.reply(taskDetails?.instruction!, {
      parse_mode: "HTML",
    });
  }
});

bot.command("task4", async (ctx) => {
  const taskDetails = await getTaskByNumber(4);
  if (!taskDetails) {
    ctx.reply("Task 4 not found");
    return;
  } else {
    ctx.reply(taskDetails?.instruction!, {
      parse_mode: "HTML",
    });
  }
});
bot.command("task5", async (ctx) => {
  const taskDetails = await getTaskByNumber(5);
  if (!taskDetails) {
    ctx.reply("Task 5 not found");
    return;
  } else {
    ctx.reply(taskDetails?.instruction!, {
      parse_mode: "HTML",
    });
  }
});
bot.command("task6", async (ctx) => {
  const taskDetails = await getTaskByNumber(6);
  if (!taskDetails) {
    ctx.reply("Task 6 not found");
    return;
  } else {
    ctx.reply(taskDetails?.instruction!, {
      parse_mode: "HTML",
    });
  }
});
// match user
bot.command("match", async (ctx) => {
  const user = await getUserDetails(ctx.from.id.toString());
  if (!user) {
    return ctx.reply(
      "You need to generate a letter first.\nUse the /letter command to generate one."
    );
  }

  const response = await findMyMatch(ctx.from.id.toString());
  ctx.reply(`User ${user.letter} ${response}`, {
    parse_mode: "HTML",
    reply_markup: matchToNewUserMenu,
  });
});

// add to transactionTable
bot.on(message("text"), async (ctx) => {
  const user = await getUserDetails(ctx.from.id.toString());
  if (!user?.letter)
    return ctx.reply(
      "You need to generate a letter first.\nUse the /letter command to generate one."
    );
  if (ctx.message.text.includes("WALLET IS")) {
    const walletID = getNumbersAfterIs(ctx.message.text);
    if (!walletID) {
      ctx.reply("Please provide a valid wallet ID");
    } else {
      const client = await createClient({
        url: process.env.REDIS_URL,
      })
        .on("error", (err) => console.log("Redis Client Error", err))
        .connect();

      await client.set(ctx.from.id.toString(), walletID);
      await client.disconnect();
      ctx.reply(
        `@${ctx.from.first_name} is your wallet ID <b>${walletID}?</b>`,
        {
          parse_mode: "HTML",
          reply_markup: addToTransactionTableMenu,
        }
      );
    }
  }
  if (ctx.message.text.includes("VOUCHER IS")) {
    const voucher = getNumbersAfterIs(ctx.message.text);
    if (!voucher) {
      ctx.reply("Please provide a valid voucher");
    } else {
      const client = await createClient({
        url: process.env.REDIS_URL,
      })
        .on("error", (err) => console.log("Redis Client Error", err))
        .connect();

      await client.set(`v-${ctx.from.id.toString()}`, voucher);
      await client.disconnect();
      const receiver = await getRecentUserMatchDetails(ctx.from.id.toString());
      if (!receiver) return ctx.reply("You need to match with a user first.");

      ctx.reply(
        `@${ctx.from.first_name} is the voucher ${voucher} generated for <b>User ${receiver?.letter}</b>?`,
        {
          parse_mode: "HTML",
          reply_markup: addToVoucherTableMenu,
        }
      );
    }
  }
});

const helpMenu = new InlineKeyboard().text("Yes", "Help").text("No", "NoHelp");

bot.action("Help", async (ctx) => {
  const user = await getUserDetails(ctx.from.id.toString());
  if (!user?.letter)
    return ctx.reply(
      "You need to generate a letter first.\nUse the /letter command to generate one."
    );

  ctx.sendMessage(`@som_tea, User ${user?.letter} is requesting for help`, {
    parse_mode: "HTML",
  });
});
bot.action("NoHelp", async (ctx) => {
  const user = await getUserDetails(ctx.from.id.toString());
  if (!user?.letter)
    return ctx.reply(
      "That's okay, but it looks like you do not have a unique letter yet.\nUse the /letter command to generate one."
    );
  ctx.reply(
    `User ${user?.letter} That's okay, just type /help when you need me.`,
    {
      parse_mode: "HTML",
    }
  );
});
const matchToNewUserMenu = new InlineKeyboard()
  .text("Yes", "MatchNewUser")
  .text("No", "DoNotMatchUser");

bot.action("MatchNewUser", async (ctx) => {
  const user = await getUserDetails(ctx.from.id.toString());
  if (!user) {
    return ctx.reply(
      "You need to generate a letter first.\nUse the /letter command to generate one."
    );
  }
  const response = await matchToNewUser(ctx.from.id.toString());
  ctx.reply(`User ${user.letter} ${response}`, { parse_mode: "HTML" });
});
bot.action("DoNotMatchUser", async (ctx) => {
  const user = await getUserDetails(ctx.from.id.toString());
  if (!user) {
    return ctx.reply(
      "You need to generate a letter first.\nUse the /letter command to generate one."
    );
  }
  ctx.reply(
    `User ${user.letter} That's okay, just type use the /match command when ready to match.`,
    {
      parse_mode: "HTML",
    }
  );
});
const addToVoucherTableMenu = new InlineKeyboard()
  .text("Yes", "AddToVoucherTable")
  .text("No", "CancelAddToVoucherTable");

const addToTransactionTableMenu = new InlineKeyboard()
  .text("Yes", "AddToTransactionTable")
  .text("No", "CancelAddToTransactionTable");

bot.action("AddToVoucherTable", async (ctx) => {
  const user = await getUserDetails(ctx.from.id.toString());
  if (!user) {
    return ctx.reply(
      `You need to generate a letter first. Use the <b>/letter</b> command to generate one.`,
      {
        parse_mode: "HTML",
      }
    );
  }
  const client = await createClient({
    url: process.env.REDIS_URL,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
  const voucher = (await client.get(`v-${ctx.from.id.toString()}`)) || "";
  const response = await addToVoucherMatchTable(
    ctx.from.id.toString(),
    voucher
  );
  if (response) {
    ctx.reply(
      `Okay, @${ctx.from.first_name} I have taken note of your voucher. Fill the poll if any, then proceed to next Task.`
    );
  } else {
    ctx.reply(
      `@${ctx.from.first_name}, It's possible I have already taken note of this voucher.\n\nIf you need a new one dial <strong>*347*541#</strong> or fill the poll if any, then proceed to next Task`,
      {
        parse_mode: "HTML",
      }
    );
  }
});
bot.action("CancelAddToVoucherTable", async (ctx) => {
  ctx.reply(
    `@${ctx.from.first_name} That's okay, just retype your voucher using this format: <strong>VOUCHER IS 1234</strong>`,
    {
      parse_mode: "HTML",
    }
  );
});

bot.action("AddToTransactionTable", async (ctx) => {
  const user = await getUserDetails(ctx.from.id.toString());
  if (!user) {
    return ctx.reply(
      `You need to generate a letter first. Use the <b>/letter</b> command to generate one.`,
      {
        parse_mode: "HTML",
      }
    );
  }
  const client = await createClient({
    url: process.env.REDIS_URL,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
  const walletID = (await client.get(ctx.from.id.toString())) || "";
  const addToTransaction = await addToTransactionTable(
    ctx.from.id.toString(),
    walletID
  );
  if (!addToTransaction) {
    ctx.reply(
      `User ${user.letter}, I have already taken note of this ID.\n\nIf you need a new one dial <strong>*347*541#</strong> and select <b>Generate Wallet ID</b>.\n\nThen type <strong>WALLET IS 1234</strong> to add it to the transaction table. Continue to <strong>Task 5</strong>.`,
      {
        parse_mode: "HTML",
      }
    );
  } else {
    ctx.reply(
      `Okay, User ${user.letter} I have taken note of your wallet ID. Fill the poll if any, then proceed to next Task.`
    );
  }
});

bot.action("CancelAddToTransactionTable", async (ctx) => {
  ctx.reply(
    `@${ctx.from.first_name} That's okay, just retype your wallet ID using this format: <strong>WALLET IS 1234</strong>`,
    {
      parse_mode: "HTML",
    }
  );
});

bot.launch();
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
