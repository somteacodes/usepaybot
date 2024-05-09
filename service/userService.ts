import { get } from "http";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getOrCreateUser = async (uid: string) => {
  let user = await prisma.user.findUnique({
    where: {
      username: uid,
    },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        username: uid,
        letter: await getUniqueLetter(),
      },
    });
  }
  return user.letter;
};

const getUniqueLetter = async () => {
  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const allUserLetters = await prisma.user.findMany({
    select: {
      letter: true,
    },
  });
  const allLetters = allUserLetters.map((user) => user.letter);
  const availableLetters = alphabet.filter(
    (letter) => !allLetters.includes(letter)
  );
  if (availableLetters.length === 0) {
    return null;
  }
  const letter =
    availableLetters[Math.floor(Math.random() * availableLetters.length)];
  return letter;
};

const getUserDetails = async (uid: string) => {
  return await prisma.user.findUnique({
    where: {
      username: uid,
    },
  });
};

const matchToNewUser = async (uid: string): Promise<string> => {
  const availableUsersToMatch = await prisma.transactionMatch.findMany({
    where: {
      matched: false,
      receiver: {
        isNot: {
          username: uid,
        },
      },
    },
  });

  if (availableUsersToMatch && availableUsersToMatch.length > 0) {
    const userToMatch = availableUsersToMatch[0];
    if (!userToMatch) {
      return "No user to match with. Try again in a few seconds.";
    }
    const receiver = await prisma.user.findUnique({
      where: {
        id: userToMatch.receiverId!,
      },
    });
    // match the user
    await prisma.transactionMatch.update({
      where: {
        id: userToMatch.id,
      },
      data: {
        matched: true,
        sender: {
          connect: {
            username: uid,
          },
        },
      },
    });
    return `You have been matched with <strong>User ${receiver?.letter}</strong>.\n\nTheir wallet ID is: <strong>${userToMatch.wallet}</strong>. \nContinue with the next steps.`;
  }
  return "There are no users to match with right now. Try again in a few seconds.";
};

const findMyMatch = async (uid: string): Promise<string> => {
  const user = await getUserDetails(uid);
  if (!user) {
    return "User not found";
  }
  const myMatch = await prisma.transactionMatch.findFirst({
    where: {
      sender: {
        is: user,
      },
      matched: true,
    },
    orderBy: {
      id: "desc",
    },
  });
  if (!myMatch) {
    return "No recent match found. Do you want to match with a new user?";
  }
  const receiver = await prisma.user.findUnique({
    where: {
      id: myMatch.receiverId!,
    },
  });
  return `You have been matched with <strong>User ${receiver?.letter}</strong>. \nTheir wallet ID is: <strong>${myMatch.wallet}</strong>. \n\nContinue with the next steps.
  
Do you want to match with a new user instead?

  `;
};

const getRecentUserMatchDetails = async (uid: string) => {
  const user = await getUserDetails(uid);
  if (!user) {
    return false;
  }
  const myMatch = await prisma.transactionMatch.findFirst({
    where: {
      sender: {
        is: user,
      },
      matched: true,
    },
    orderBy: {
      id: "desc",
    },
  });
  if (!myMatch) {
    return false;
  } else {
    return await prisma.user.findUnique({
      where: {
        id: myMatch.receiverId!,
      },
    });
  }
};

const addToTransactionTable = async (
  uid: string,
  walletID: string
): Promise<boolean> => {
  const user = await getUserDetails(uid);
  if (!user) {
    return false;
  }
  const isUserOnTransactionTable = await prisma.transactionMatch.findFirst({
    where: {
      wallet: walletID,
      receiver: {
        is: user,
      },
    },
  });
  if (!isUserOnTransactionTable) {
    // add user to transaction table
    await prisma.transactionMatch.create({
      data: {
        wallet: walletID,
        matched: false,
        receiver: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return true;
  } else {
    return false;
  }
};
const addToVoucherMatchTable = async (uid: string, voucher: string) => {
  const user = await getUserDetails(uid);
  if (!user) {
    return false;
  }
  const isUserOnVoucherTable = await prisma.voucherMatch.findFirst({
    where: {
      voucher,
      sender: {
        is: user,
      },
    },
  });
  const receiver = await getRecentUserMatchDetails(uid);
  console.log("receiver", receiver);
  if (!isUserOnVoucherTable && receiver) {
    // add user to voucher table
    await prisma.voucherMatch.create({
      data: {
        voucher,
        matched: false,
        sender: {
          connect: {
            id: user.id,
          },
        },
        receiver: {
          connect: {
            id: receiver.id,
          },
        },
      },
    });
    return true;
  } else {
    return false;
  }
  
};

const getNumbersAfterIs = (text: string = "") => {
  // Convert the text to lowercase for case-insensitive matching
  text = text.toUpperCase();

  // Find the index of the word "is"
  const isIndex = text.indexOf("IS");

  // Check if "is" is found and there are characters after it
  if (isIndex !== -1 && isIndex + 2 < text.length) {
    // Extract the substring containing only digits after "is"
    const match = text.substring(isIndex + 3).match(/\d+/);
    if (match !== null) {
      return match[0];
    }
  }
  return "";
};

const getTaskByNumber = async (taskNumber: number) => {
  return await prisma.task.findFirst({
    where: {
      task: taskNumber,
    },
  });
};

const countAllTasks = async () => {
  return await prisma.task.count();
};
export {
  getOrCreateUser,
  getNumbersAfterIs,
  addToTransactionTable,
  matchToNewUser,
  findMyMatch,
  getUserDetails,
  getTaskByNumber,
  countAllTasks,
  getRecentUserMatchDetails,
  addToVoucherMatchTable,
};
