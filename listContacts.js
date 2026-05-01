import * as fs from "node:fs";
import { v7 as uuidv7 } from "uuid";
import validator from "validator";
import { mySchema } from "./mySchema.js";
import chalk from "chalk";
import Table from "cli-table3";

export function listData() {
  const contacts = loadFile();

  if (contacts.length === 0) {
    console.log(chalk.red.inverse.bold("The data is not found"));
    return false;
  }

  const table = new Table({
    head: ["No", "Nama", "No HP", "Email", "..."],
    style: { head: ["cyan"] },
  });

  contacts.forEach((item, index) => {
    table.push([
      index + 1,
      capitalize(item.nama),
      item.nohp,
      item.email || "-",
      "...",
    ]);
  });

  console.log(table.toString());
}
