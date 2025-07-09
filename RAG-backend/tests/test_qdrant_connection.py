from vectorstores.qdrant_store import create_qdrant_client

client = create_qdrant_client()
print("✅ Connected to Qdrant Cloud!")

# See existing collections
print(client.get_collections())
