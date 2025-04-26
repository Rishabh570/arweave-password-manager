import Arweave from 'arweave';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

// Function to create a transaction and post it to Arweave
export async function createTransaction(data: string, userId: string): Promise<string> {
  const transaction = await arweave.createTransaction({ data });
  
  transaction.addTag('App-Name', 'password-manager');
  transaction.addTag('User-ID', userId);
  transaction.addTag('Content-Type', 'application/json');
  
  await arweave.transactions.sign(transaction);
  await arweave.transactions.post(transaction);
  
  return transaction.id;
}

// Function to query transactions from Arweave
export async function queryTransactions(userId: string): Promise<string[]> {
  const query = {
    op: 'and',
    expr1: { op: 'equals', expr1: 'App-Name', expr2: 'password-manager' },
    expr2: { op: 'equals', expr1: 'User-ID', expr2: userId }
  };
  
  const txIds = await arweave.api.post('arql', query).then(res => res.data);
  return txIds;
}

// Function to get data from a transaction
export async function getTransactionData(txId: string): Promise<string> {
  const data = await arweave.transactions.getData(txId, { decode: true, string: true });
  return data;
}