import sys
import pandas as pd

datafile = sys.argv[1]

df = pd.read_json(datafile)
print(df.head(3))