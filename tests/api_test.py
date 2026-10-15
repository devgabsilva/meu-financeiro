import json,urllib.request,urllib.error,unittest
BASE='http://127.0.0.1:5173/api/entries'
def call(path='',data=None):
 request=urllib.request.Request(BASE+path,data=json.dumps(data).encode() if data is not None else None,headers={'Content-Type':'application/json'})
 try:
  with urllib.request.urlopen(request) as response:return response.status,json.load(response)
 except urllib.error.HTTPError as error:return error.code,json.load(error)
class ApiTest(unittest.TestCase):
 def test_validation_and_month(self):
  self.assertEqual(call('?month=invalid')[0],400)
  valid={'type':'receita','description':'Teste API','amount':'0,10','category':'Teste','date':'2099-01-02'}
  for change in [{'amount':'-1'},{'amount':'0'},{'category':''},{'date':'2026-02-30'}]:self.assertEqual(call(data={**valid,**change})[0],400)
  before=call('?month=2099-01')[1]['summary']['balance']
  self.assertEqual(call(data=valid)[0],201)
  self.assertEqual(call(data={**valid,'type':'despesa','amount':'0,03'})[0],201)
  self.assertEqual(call('?month=2099-01')[1]['summary']['balance'],before+7)
  self.assertEqual(call('?month=2099-02')[1]['summary']['balance'],0)
if __name__=='__main__':unittest.main()
