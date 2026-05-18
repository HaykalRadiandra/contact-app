import { loadFile, capitalize, formatValue } from "./contacts.js";
import chalk from "chalk";
import Table from "cli-table3";
import validator from "validator";

export default function listDataDetail(keyword) {
  const isEmail = validator.isEmail(keyword);
  const isPhone = validator.isMobilePhone(keyword, "id-ID");

  if (!isEmail && !isPhone) {
    return (
      console.log(chalk.red.bold("Input data harus berupa No HP atau Email")),
      false
    );
  }
  const contacts = loadFile();

  const columns = [
    { key: "id", label: "ID" },
    { key: "nama", label: "Nama", format: capitalize },
    { key: "nohp", label: "No HP" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", format: capitalize },
    {
      key: "isActive",
      label: "Active",
      format: (val) => (val ? "Iya" : "Tidak"),
    },
  ];

  const result = contacts.find((c) => {
    return c.nohp === keyword || c.email === keyword;
  });

  if (!result) {
    console.log(chalk.red("Data tidak ditemukan"));
    return false;
  }

  const table = new Table({
    head: [...columns.map((c) => c.label)],
    style: { head: ["cyan"] },
  });

  table.push(columns.map((c) => formatValue(result[c.key], c.format)));

  console.log(table.toString());
}
