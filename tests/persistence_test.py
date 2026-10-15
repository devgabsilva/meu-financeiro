import pathlib,sqlite3,tempfile,unittest
class PersistenceTest(unittest.TestCase):
 def test_persistence_and_months(self):
  with tempfile.TemporaryDirectory() as directory:
   path=pathlib.Path(directory)/'finance.sqlite'
   connection=sqlite3.connect(path)
   migrations=sorted(pathlib.Path('drizzle').glob('*.sql'))
   self.assertTrue(migrations,'Migração deve existir')
   for migration in migrations: connection.executescript(migration.read_text(encoding='utf-8'))
   rows=[('receita',"Salário ' especial",10001,'Trabalho','2026-10-01'),('despesa','Mercado',3002,'Alimentação','2026-10-31'),('despesa','Outro mês',999,'Outros','2026-11-01')]
   connection.executemany('INSERT INTO entries(type,description,cents,category,date) VALUES (?,?,?,?,?)',rows)
   connection.commit();connection.close()
   reopened=sqlite3.connect(path)
   results=reopened.execute('SELECT type,cents FROM entries WHERE date >= ? AND date <= ? ORDER BY date',('2026-10-01','2026-10-31')).fetchall()
   self.assertEqual(results,[('receita',10001),('despesa',3002)])
   self.assertEqual(sum(value if kind=='receita' else -value for kind,value in results),6999)
   self.assertEqual(reopened.execute('SELECT COUNT(*) FROM entries WHERE date >= ? AND date <= ?',('2026-12-01','2026-12-31')).fetchone()[0],0)
   reopened.close()
if __name__=='__main__':unittest.main()
