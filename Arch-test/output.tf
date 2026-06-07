output "resource_group_name" {
  value       = azurerm_resource_group.rg.name
  description = "The name of the scoped resource group"
}

output "frontend_endpoint_frontendno" {
  value       = azurerm_static_web_app.spa_frontend_frontendno.default_host_name
  description = "Public static hosting hostname of the frontend SPA application"
}
output "backend_api_url_backendnod" {
  value       = azurerm_container_app.api_backend_backendnod.ingress[0].fqdn
  description = "Fully Qualified Domain Name of the containerized core backend API service"
}
output "backend_api_url_queuenode" {
  value       = azurerm_container_app.api_backend_queuenode.ingress[0].fqdn
  description = "Fully Qualified Domain Name of the containerized core backend API service"
}
output "redis_hostname_cachenode" {
  value       = azurerm_redis_cache.redis_cache_cachenode.hostname
  description = "Host connection string endpoint of the Redis caching cluster"
}
output "database_endpoint_databaseno" {
  value       = azurerm_cosmosdb_account.cosmos_db_databaseno.endpoint
  description = "The connection endpoint of the Cosmos DB NoSQL account"
}
