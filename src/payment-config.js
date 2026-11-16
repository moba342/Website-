// Receiving addresses are public. Never put wallet private keys in this file.
export const paymentConfig={
  token:'USDT',
  usdtPerUsd:1,
  confirmation:'manual-telegram',
  networks:[
    {id:'BEP20',label:'BNB Smart Chain',standard:'BEP20',address:'0x3bdb1efb243d1afcdf9780a84b5326e65dacf6c6',explorer:'https://bscscan.com/tx/'},
    {id:'TRC20',label:'TRON',standard:'TRC20',address:'TVQmggCyZymbEV3JqFcTznUZCWdcZrNXZY',explorer:'https://tronscan.org/#/transaction/'}
  ]
};
export const isConfiguredNetwork=network=>network?.id==='BEP20'?/^0x[0-9a-fA-F]{40}$/.test(network.address):network?.id==='TRC20'?/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(network.address):false;
export const findPaymentNetwork=id=>paymentConfig.networks.find(n=>n.id===id);
export function validTransactionHash(hash,network){return network==='BEP20'?/^0x[0-9a-fA-F]{64}$/.test(hash):network==='TRC20'?/^[0-9a-fA-F]{64}$/.test(hash):false;}
