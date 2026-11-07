"""Bounded Nmap wrapper for explicitly scoped, authorized targets.
Produces an XML export for manual import; receives no cloud commands.
"""
import argparse,ipaddress,json,re,subprocess,pathlib,shutil

def command(target,scope,output):
    allowed=scope.get('targets',[])
    if target not in allowed: raise ValueError('Target is not in the exact scope allowlist.')
    if not re.fullmatch(r'[a-zA-Z0-9.:-]{1,253}',target) or target.startswith('-'): raise ValueError('Invalid target.')
    try:
        ip=ipaddress.ip_address(target)
        if not ip.is_global and not scope.get('allow_private_lab',False): raise ValueError('Private lab addresses require allow_private_lab in scope.')
    except ValueError as e:
        if ':' in target or re.fullmatch(r'[\d.]+',target): raise e
        if '.' not in target and target!='localhost': raise ValueError('Use a fully qualified hostname or explicit IP.')
        if target=='localhost' and not scope.get('allow_private_lab',False): raise ValueError('Localhost requires explicit lab scope.')
    return ['nmap','--unprivileged','-sT','-sV','--version-light','--top-ports','100','-T3','--max-retries','1','--host-timeout','60s','-oX',str(output),target]

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--scope',required=True,type=pathlib.Path);p.add_argument('--target',required=True);p.add_argument('--output',type=pathlib.Path,default=pathlib.Path('scan.xml'));p.add_argument('--confirm-authorization',action='store_true');p.add_argument('--dry-run',action='store_true');a=p.parse_args()
    if not a.confirm_authorization: p.error('Confirm ownership or permission using --confirm-authorization.')
    if a.output.exists(): p.error('Output exists; choose a new path to preserve original exports.')
    args=command(a.target,json.loads(a.scope.read_text()),a.output)
    if a.dry_run: print(json.dumps(args));return
    if not shutil.which('nmap'): p.error('Install Nmap from its official source first.')
    subprocess.run(args,check=True,timeout=100,shell=False)
if __name__=='__main__': main()
