export async function createConnection (mongoose) {
  console.log('Connecting to db');
  try {
    await mongoose.connect('mongodb+srv://root:whatislove@cluster.ljwrjc4.mongodb.net/?retryWrites=true&w=majority');
    return mongoose;
  } catch (e) {
    console.error(e);
  }
}
