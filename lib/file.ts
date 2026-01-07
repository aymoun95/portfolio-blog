import fs from "fs";
import path from "path";

const root = process.cwd();

export async function getAllFiles<T>(dir: string): Promise<T[]> {
  const files = fs.readdirSync(path.join(root, dir));

  return files.reduce((all: T[], current: string) => {
    const source = fs.readFileSync(path.join(root, dir, current), "utf8");
    const data = JSON.parse(source);
    return [data, ...all];
  }, []);
}
