export function validateEntry(x) {
 if (!x || typeof x !== 'object' || !['receita','despesa'].includes(x.type)) throw Error('Selecione o tipo do lançamento.');
 for (const key of ['description','category']) if(typeof x[key] !== 'string' || !x[key].trim() || x[key].trim().length>150) throw Error('Preencha descrição e categoria (até 150 caracteres).');
 if(typeof x.amount !== 'string' || !/^\d{1,10}([.,]\d{1,2})?$/.test(x.amount)) throw Error('Informe um valor positivo com até duas casas decimais.');
 const [whole,fraction='']=x.amount.replace(',','.').split('.'); const cents=Number(whole)*100+Number(fraction.padEnd(2,'0'));
 if(cents<=0 || !Number.isSafeInteger(cents)) throw Error('O valor deve ser maior que zero.');
 if(typeof x.date!=='string' || !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date<'1900-01-01' || x.date>'9999-12-31' || new Date(x.date+'T12:00:00Z').toISOString().slice(0,10)!==x.date) throw Error('Informe uma data válida.');
 return {type:x.type,description:x.description.trim(),category:x.category.trim(),date:x.date,cents};
}
export function summarize(rows){return rows.reduce((a,r)=>{a[r.type]+=r.cents;a.balance=a.receita-a.despesa;return a},{receita:0,despesa:0,balance:0});}
export function monthRange(month){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw Error('Selecione um mês válido.');return [month+'-01',month+'-31'];}
