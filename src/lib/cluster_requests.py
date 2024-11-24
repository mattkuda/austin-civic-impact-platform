from pymongo import MongoClient
from sklearn.cluster import KMeans
import numpy as np
import os

N_CLUSTERS = 3

def cluster_requests():
  uri = os.getenv("MONGODB_URI")
  client = MongoClient(uri)
  db = client["acip"]
  collection = db["requests"]

  unclustered_requests = list(collection.find({"cluster": {"$exists": False}}))

  if not unclustered_requests:
      print("No unclustered data found.")
      exit(0)

  coordinates = np.array([[req["location"]["lat"], req["location"]["long"]] for req in unclustered_requests])

  labels = KMeans(n_clusters=N_CLUSTERS, random_state=42).fit(coordinates).predict(coordinates).tolist()
  
  for id, label in enumerate(labels):
      collection.update_one({"_id": unclustered_requests[id]["_id"]}, {"$set": {"cluster": label}})

  print("Clustering complete!")

if __name__ == "__main__":
    cluster_requests()