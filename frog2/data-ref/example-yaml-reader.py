# python libs
import os
import sys

# third party libs
import yaml

#---------------------------
class Computer(object):
#---------------------------

  def __init__( self ):

    self.name = ''
    self.url = None
    self.os = None
    self.salt_access = None
    self.software = []

#---------------------------
class Application(object):
#---------------------------

  def __init__( self ):

    self.area = ''
    self.name = ''
    self.packages = []
    self.inputs = []
    self.dependencies = []
    self.machines = []

#---------------------------
class CaseCollection(object):
#---------------------------

  def __init__( self ):

    self.collection = {}

  def process( self, data ):

    application = data['application']

    if not self.collection.has_key(application): self.collection[application] = []

    self.collection[application].append( data )

  def total_count( self ):

    cnt = 0;

    for key in self.collection.keys(): cnt += len( self.collection[key] )

    return cnt

#---------------------------
# main.py
#---------------------------

stream = file('example.yaml','r')

computers = []
applications = {}
cases = CaseCollection()

# 1. process the yaml file

for data in yaml.load_all( stream ):

  if type(data) is dict: 

    if data.has_key('computer'):

      info = data['computer']

      c = Computer()
      c.name     = info['name']
      c.url      = info['url']
      c.os       = info['os']
      c.software = info['software']

      computers.append(c)

    elif data.has_key('application'):

      info = data['application']

      print '---'
      print info

      a = Application()
      a.area         = info['area']
      a.name         = info['name']
      a.packages     = info['packages']
      a.inputs       = info['inputs']
      a.dependencies = info['dependencies']

      applications[a.name] = a

    elif data.has_key('case'):

      info = data['case']

      cases.process( info )

    else:
      print data
      sys.stdout.flush()

print '---------------'

print 'num computers =', len(computers)
print 'num applications  =', len(applications)
print 'num cases =', cases.total_count()

# 2. list computers

print '---------------'

for c in computers:

  print c.name, c.url

  if c.name == 'halo':
    cmd = 'ping ' + c.url
    print cmd
    #os.system(cmd)

# 3. deduce potential runtime machines

print '---------------'

for key in applications.keys():

  app = applications[key]

  machines = []
  for c in computers:
    runs = 1
    for sw in app.packages:
      if sw not in c.software: runs = 0
    if runs and c.name not in machines: machines.append( c.name )
  app.machines = machines

  #print a.name, a.inputs.keys(), a.inputs['parameters']['extensions']
  print app.name, 'application',
  print 'can run on computers', app.machines

# 4. dependency graph

print '----dependencies---------'

import networkx as nx
import matplotlib.pyplot as plt

G = nx.DiGraph()

for key in applications.keys():

  app = applications[key]

  src = app.area + '=' + app.name

  tgts = []
  for t in app.dependencies:
    if type(t) is str:
      if not t == 'none': print 'aaaaa'
    if type(t) is dict:
     for tkey in t:
      tlist = t[tkey]
      if type(tlist) is list:
        for x in t:
          for key in applications.keys():
            a = applications[key]
            if   x == a.name: tgt = a.area+'='+a.name
            elif x == a.area: tgt = a.area+'='+a.name
            else: tgt = x
            if tgt == '_none' or "=" in tgt:
              if tgt not in tgts: tgts.append(tgt)
      if type(tlist) is str:
        if tlist == 'any':
          for key in applications.keys():
            a = applications[key]
            if   tkey == a.name: tgt = a.area+'='+a.name
            elif tkey == a.area: tgt = a.area+'='+a.name
            else: tgt = t
            if tgt == '_none' or "=" in tgt:
              if tgt not in tgts: tgts.append(tgt)

  print src, tgts

  for t in tgts: G.add_edge( src, t )

#nx.draw_networkx(G); plt.show()

print '----topo-sort------'

p = nx.topological_sort( G, reverse=1 )
print p


  

