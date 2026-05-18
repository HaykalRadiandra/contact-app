import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import {
  listData,
  listDataDetail,
  removeData,
  simpanContact,
} from "./contacts.js";

yargs(hideBin(process.argv))
  .command({
    command: "add",
    describe: "Menambahkan data",
    builder: {
      name: {
        describe: "Add your name",
        demandOption: true,
        type: "string",
        alias: "n",
      },
      email: {
        describe: "Add your email",
        type: "string",
        alias: "e",
      },
      nohp: {
        describe: "Add your noHP",
        type: "string",
        alias: "p",
        demandOption: true,
      },
      role: {
        describe: "Add your role",
        demandOption: true,
        type: "string",
        choices: ["dosen", "mahasiswa"],
        alias: "r",
        coerce: (val) => val.toLowerCase(),
      },
      isActive: {
        type: "boolean",
        default: true,
        alias: "i",
      },
    },
    handler: (argv) => {
      simpanContact(argv.name, argv.email, argv.nohp, argv.role, argv.isActive);
    },
  })
  .command({
    command: "list",
    describe: "Menampilkan data",
    handler: () => {
      listData();
    },
  })
  .command({
    command: "detail",
    describe: "Menampilkan detail",
    builder: {
      keyword: {
        describe: "Data detail based no HP/email",
        demandOption: true,
        type: "string",
        alias: "k",
      },
    },
    handler: (argv) => {
      listDataDetail(argv.keyword);
    },
  })
  .command({
    command: "delete",
    describe: "Menghapus data",
    builder: {
      remove: {
        describe: "Delete data based id / email / nohp",
        demandOption: true,
        type: "string",
        alias: "r",
      },
    },
    handler: (argv) => {
      removeData(argv.remove);
    },
  })
  .check((argv) => {
    if (argv._[0] === "add" && argv.role === "dosen" && !argv.email) {
      throw new Error("Dosen wajib punya email!");
    }
    return true;
  })
  .demandCommand(1, "You need at least one command before moving on")
  .parse();
