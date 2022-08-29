import fs from "fs";
import path from "path";

export async function registerSchemas(mongoose) {
  console.log('Connecting schemas');
  try {
    const directoryPath = path.join(`${path.resolve()}/src/db/schemas`);
    const schemasFiles = await fs.promises.readdir(directoryPath);

    schemasFiles.forEach(async (fileName) => {
      const schemaName = fileName.split(".")[0];
      const schema = JSON.parse(
        (await fs.promises.readFile(`${directoryPath}/${fileName}`)).toString()
      );

      mongoose.model(schemaName, schema);
    });
  } catch (e) {
    console.error(e);
  }
}
