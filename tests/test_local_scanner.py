import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from local_scanner import command
class ScannerScopeTests(unittest.TestCase):
 def test_exact_scope(self):
  with self.assertRaises(ValueError):command('other.example',{'targets':['example.com']},Path('out.xml'))
 def test_no_command_injection(self):
  with self.assertRaises(ValueError):command('example.com;whoami',{'targets':['example.com;whoami']},Path('out.xml'))
 def test_private_scope_required(self):
  with self.assertRaises(ValueError):command('127.0.0.1',{'targets':['127.0.0.1']},Path('out.xml'))
 def test_bounded_arguments(self):
  result=command('127.0.0.1',{'targets':['127.0.0.1'],'allow_private_lab':True},Path('out.xml'));self.assertIn('--top-ports',result);self.assertEqual(result[-1],'127.0.0.1');self.assertNotIn('--script',result)
if __name__=='__main__':unittest.main()
