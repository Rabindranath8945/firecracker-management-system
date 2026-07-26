import { execFile } from "child_process";
import { promisify } from "util";

const exec = promisify(execFile);

export async function scanInvoice(imagePath: string): Promise<string> {
  const { stdout, stderr } = await exec(
    "python",
    ["python/paddle_ocr.py", imagePath],
    {
      maxBuffer: 20 * 1024 * 1024,
    },
  );

  if (stderr) {
    console.error(stderr);
  }

  return stdout.trim();
}
