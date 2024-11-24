from pymongo import MongoClient
from sklearn.cluster import KMeans
import numpy as np
import os

import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os

import pandas as pd
import networkx as nx
import community as community_louvain

model = SentenceTransformer('multi-qa-MiniLM-L6-cos-v1')


requests = [
    {"id": 1, "description": "Add more bike lanes", "votes": 15},
    {"id": 2, "description": "Expand community gardens", "votes": 10},
    {"id": 3, "description": "Improve public transportation", "votes": 20},
    {"id": 4, "description": "Fix playground swing", "votes": 25},
    {"id": 5, "description": "Feed raccoons", "votes": 30},
    {"id": 6, "description": "Clean up graffiti", "votes": 18},
    {"id": 7, "description": "Plant more trees", "votes": 22},
    {"id": 8, "description": "Fix street lights", "votes": 12},
    {"id": 9, "description": "Add recycling bins", "votes": 28},
    {"id": 10, "description": "Repair sidewalk cracks", "votes": 15}
]


def score_similarity(requests):
    descriptions = [req["description"] for req in requests]
    embeddings = model.encode(descriptions)
    similarity_matrix = cosine_similarity(embeddings)
    threshold = 0
    similar_pairs = []
    for i in range(len(requests)):
        for j in range(i + 1, len(requests)): 
            if similarity_matrix[i][j] > threshold:
                similar_pairs.append({
                    "requestAId": requests[i]["_id"],
                    "requestBId": requests[j]["_id"],
                    "requestA": requests[i]["description"],
                    "requestB": requests[j]["description"],
                    "similarity": similarity_matrix[i][j]
                })
    return similar_pairs


# # print("Similar Requests:", similar_pairs)
# for pair in sorted(similar_pairs, key=lambda x: x["similarity"], reverse=True):
#     print(round(pair["similarity"], 2), pair["requestAId"], pair["requestBId"],  pair["requestA"]["description"], pair["requestB"]["description"])

# ================================

def theme_cluster_requests(similar_pairs):
    print(similar_pairs)
    data = pd.DataFrame(similar_pairs)
    data.columns = ["idA", "idB", "requestA", "requestB", "similarity"]
    graph = nx.Graph()

    # Add edges with weights
    for _, row in data.iterrows():
        print(row["idA"], row["idB"], row["similarity"])
        graph.add_edge(row["idA"], row["idB"], weight=row["similarity"])

    partition = community_louvain.best_partition(graph, weight="weight")
    clusters = {}
    for node, cluster in partition.items():
        clusters.setdefault(cluster, []).append(node)
    return clusters


# ================================================

N_CLUSTERS = 3

def cluster_requests():
  uri = os.getenv("MONGODB_URI")
  client = MongoClient(uri)
  db = client["acip"]
  collection = db["requests"]

  unclustered_requests = list(collection.find({
      "location": {"$exists": True},
      "location.lat": {"$ne": None},
      "location.long": {"$ne": None},
      "cluster": {"$exists": False} 
  }))

  if not unclustered_requests:
      print("No unclustered data found.")
      exit(0)

  coordinates = np.array([[req["location"]["lat"], req["location"]["long"]] for req in unclustered_requests])

  CLUSTERED_COUNT = int(os.getenv("CLUSTERED_COUNT", 0))
  labels = KMeans(n_clusters=N_CLUSTERS, random_state=42).fit(coordinates).predict(coordinates).tolist()
  clustered_requests = {}
  location_clusters = {}

  for i, label in enumerate(labels):
      clustered_requests.setdefault(label, []).append(i)
  

  for location_cluster, request_idxs in clustered_requests.items():
      cluster_requests = [unclustered_requests[idx] for idx in request_idxs]
      similar_pairs = score_similarity(cluster_requests)
      theme_clusters = theme_cluster_requests(similar_pairs)
      print(theme_clusters)

      for theme_cluster, request_idxs in theme_clusters.items():
          # Combined cluster number = location_cluster * 100 + theme_cluster
          combined_cluster = ((location_cluster+1+CLUSTERED_COUNT) * 100 + theme_cluster)
          location_clusters.setdefault(combined_cluster, []).extend(request_idxs)


  for cluster_num, requests_ids in location_clusters.items():
      collection.update_many({"_id": {"$in": requests_ids}}, {"$set": {"cluster": cluster_num}})

  print("Clustering complete!")

if __name__ == "__main__":
    cluster_requests()